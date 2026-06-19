import asyncio
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.chapter import Chapter
from app.models.job import Job
from app.services.audio_service import create_audio_asset, fail_audio_asset, finalize_audio_asset, get_text_for_audio
from app.services.book_service import recalc_book
from app.services.notification_service import create_notification, update_notification, broadcast_notification
from app.services.replacement_service import apply_replacements
from app.services.translation_service import translation_service
from app.services.tts_service import tts_service
from app.utils.ids import generate_id
from app.services.event_bus import event_bus

def _schedule(coro):
    loop = asyncio.get_running_loop()
    loop.create_task(coro)
def serialize_job(job: Job):
    return {
        "id": job.id,
        "type": job.type,
        "scope": job.scope,
        "status": job.status,
        "progress": job.progress,
        "message": job.message,
        "error": job.error,
        "book_id": job.book_id,
        "chapter_id": job.chapter_id,
        "audio_asset_id": job.audio_asset_id,
        "created_at": job.created_at.isoformat(),
        "updated_at": job.updated_at.isoformat(),
    }

async def broadcast_job(job: Job):
    await event_bus.publish({"kind": "job", "payload": serialize_job(job)})

def create_job(db: Session, *, type: str, scope: str, book_id: str | None = None,
               chapter_id: str | None = None, audio_asset_id: str | None = None, message: str = "Queued"):
    job = Job(
        id=generate_id("job"),
        type=type,
        scope=scope,
        book_id=book_id,
        chapter_id=chapter_id,
        audio_asset_id=audio_asset_id,
        status="queued",
        progress=0,
        message=message
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

def update_job(db: Session, job_id: str, **updates):
    job = db.get(Job, job_id)
    for key, value in updates.items():
        setattr(job, key, value)
    db.commit()
    db.refresh(job)
    return job

def list_jobs(db: Session, book_id: str | None = None, active_only: bool = False):
    query = db.query(Job)
    if book_id:
        query = query.filter(Job.book_id == book_id)
    if active_only:
        query = query.filter(Job.status.in_(["queued", "running", "started"]))
    return [serialize_job(job) for job in query.order_by(Job.updated_at.desc()).all()]

def spawn_book_translation(book_id: str, target_language: str):
    async def run():
        db = SessionLocal()
        job = create_job(db, type="translate_book", scope="book", book_id=book_id, message="Translation queued")
        note = create_notification(db, type="translation", title="Book translation started",
                                   message="Book translation job started.", status="started",
                                   related_entity_type="book", related_entity_id=book_id)
        await broadcast_job(job); await broadcast_notification(note)
        try:
            chapters = db.query(Chapter).filter(Chapter.book_id == book_id).order_by(Chapter.chapter_number).all()
            total = max(len(chapters), 1)
            update_job(db, job.id, status="running", message="Translating chapters")
            for index, chapter in enumerate(chapters, start=1):
                chapter.translation_status = "running"
                db.commit()
                chapter.translated_text = translation_service.translate_text(chapter.original_text, target_language)
                chapter.translation_status = "completed"
                progress = int(index / total * 100)
                current_job = update_job(db, job.id, progress=progress, status="running", message=f"Translated chapter {chapter.chapter_number}")
                current_note = update_notification(db, note.id, progress=progress, status="running", message=current_job.message)
                await broadcast_job(current_job); await broadcast_notification(current_note)
                await asyncio.sleep(0.2)
            current_job = update_job(db, job.id, progress=100, status="completed", message="Book translation completed")
            current_note = update_notification(db, note.id, progress=100, status="completed", message="Book translation completed")
            recalc_book(db, book_id)
            await broadcast_job(current_job); await broadcast_notification(current_note)
        except Exception as exc:
            current_job = update_job(db, job.id, status="failed", error=str(exc), message="Book translation failed")
            current_note = update_notification(db, note.id, status="failed", message=f"Book translation failed: {exc}")
            await broadcast_job(current_job); await broadcast_notification(current_note)
        finally:
            db.close()
    _schedule(run())

def spawn_chapter_translation(book_id: str, chapter_id: str, target_language: str):
    async def run():
        db = SessionLocal()
        job = create_job(db, type="translate_chapter", scope="chapter", book_id=book_id, chapter_id=chapter_id, message="Chapter translation queued")
        note = create_notification(db, type="translation", title="Chapter translation started",
                                   message="Chapter translation job started.", status="started",
                                   related_entity_type="chapter", related_entity_id=chapter_id)
        await broadcast_job(job); await broadcast_notification(note)
        try:
            chapter = db.get(Chapter, chapter_id)
            chapter.translation_status = "running"; db.commit()
            job = update_job(db, job.id, status="running", progress=35, message="Translating chapter text")
            note = update_notification(db, note.id, status="running", progress=35, message=job.message)
            await broadcast_job(job); await broadcast_notification(note)
            chapter.translated_text = translation_service.translate_text(chapter.original_text, target_language)
            chapter.translation_status = "completed"; db.commit()
            job = update_job(db, job.id, status="completed", progress=100, message="Chapter translation completed")
            note = update_notification(db, note.id, status="completed", progress=100, message=job.message)
            recalc_book(db, book_id)
            await broadcast_job(job); await broadcast_notification(note)
        except Exception as exc:
            job = update_job(db, job.id, status="failed", error=str(exc), message="Chapter translation failed")
            note = update_notification(db, note.id, status="failed", message=f"Chapter translation failed: {exc}")
            await broadcast_job(job); await broadcast_notification(note)
        finally:
            db.close()
    _schedule(run())

def spawn_book_replacement(book_id: str, replacements: list[dict], source_text_type: str):
    async def run():
        db = SessionLocal()
        job = create_job(db, type="replace_book", scope="book", book_id=book_id, message="Book replacement queued")
        note = create_notification(db, type="replacement", title="Book replacement started",
                                   message="Replacement rules are being applied.", status="started",
                                   related_entity_type="book", related_entity_id=book_id)
        await broadcast_job(job); await broadcast_notification(note)
        try:
            chapters = db.query(Chapter).filter(Chapter.book_id == book_id).order_by(Chapter.chapter_number).all()
            total = max(len(chapters), 1)
            for index, chapter in enumerate(chapters, start=1):
                chapter.replacement_status = "running"; db.commit()
                source_text = getattr(chapter, f"{source_text_type}_text", None) if source_text_type in ["translated", "replaced"] else chapter.original_text
                if source_text_type == "translated":
                    source_text = chapter.translated_text or ""
                if source_text_type == "replaced":
                    source_text = chapter.replaced_text or chapter.translated_text or ""
                chapter.replaced_text = apply_replacements(source_text or "", replacements)
                chapter.replacement_status = "completed"; db.commit()
                progress = int(index / total * 100)
                job = update_job(db, job.id, status="running", progress=progress, message=f"Replaced chapter {chapter.chapter_number}")
                note = update_notification(db, note.id, status="running", progress=progress, message=job.message)
                await broadcast_job(job); await broadcast_notification(note)
            job = update_job(db, job.id, status="completed", progress=100, message="Book replacement completed")
            note = update_notification(db, note.id, status="completed", progress=100, message=job.message)
            recalc_book(db, book_id)
            await broadcast_job(job); await broadcast_notification(note)
        except Exception as exc:
            job = update_job(db, job.id, status="failed", error=str(exc), message="Book replacement failed")
            note = update_notification(db, note.id, status="failed", message=f"Book replacement failed: {exc}")
            await broadcast_job(job); await broadcast_notification(note)
        finally:
            db.close()
    _schedule(run())

def spawn_chapter_replacement(book_id: str, chapter_id: str, replacements: list[dict], source_text_type: str):
    async def run():
        db = SessionLocal()
        job = create_job(db, type="replace_chapter", scope="chapter", book_id=book_id, chapter_id=chapter_id, message="Chapter replacement queued")
        note = create_notification(db, type="replacement", title="Chapter replacement started",
                                   message="Replacement rules are being applied.", status="started",
                                   related_entity_type="chapter", related_entity_id=chapter_id)
        await broadcast_job(job); await broadcast_notification(note)
        try:
            chapter = db.get(Chapter, chapter_id)
            chapter.replacement_status = "running"; db.commit()
            source_text = chapter.original_text if source_text_type == "original" else (
                chapter.translated_text if source_text_type == "translated" else (chapter.replaced_text or chapter.translated_text or "")
            )
            chapter.replaced_text = apply_replacements(source_text or "", replacements)
            chapter.replacement_status = "completed"; db.commit()
            job = update_job(db, job.id, status="completed", progress=100, message="Chapter replacement completed")
            note = update_notification(db, note.id, status="completed", progress=100, message=job.message)
            recalc_book(db, book_id)
            await broadcast_job(job); await broadcast_notification(note)
        except Exception as exc:
            job = update_job(db, job.id, status="failed", error=str(exc), message="Chapter replacement failed")
            note = update_notification(db, note.id, status="failed", message=f"Chapter replacement failed: {exc}")
            await broadcast_job(job); await broadcast_notification(note)
        finally:
            db.close()
    _schedule(run())

def spawn_chapter_audio(book_id: str, chapter_id: str, language: str, speaker_id: str, source_text_type: str, accent: str):
    async def run():
        db = SessionLocal()
        chapter = db.get(Chapter, chapter_id)
        asset, speaker = create_audio_asset(db, chapter=chapter, language=language, speaker_id=speaker_id, source_text_type=source_text_type, accent=accent)
        job = create_job(db, type="generate_audio_chapter", scope="audio", book_id=book_id, chapter_id=chapter_id, audio_asset_id=asset.id, message="Audio generation queued")
        note = create_notification(db, type="audio", title="Chapter audio started",
                                   message=f"Generating {speaker['display_name']} audio.", status="started",
                                   related_entity_type="chapter", related_entity_id=chapter_id)
        await broadcast_job(job); await broadcast_notification(note)
        try:
            chapter.audio_status = "running"; db.commit()
            job = update_job(db, job.id, status="running", progress=30, message="Preparing source text")
            note = update_notification(db, note.id, status="running", progress=30, message=job.message)
            await broadcast_job(job); await broadcast_notification(note)
            text = get_text_for_audio(chapter, source_text_type)
            path, duration = tts_service.synthesize(text, language, accent)
            finalize_audio_asset(db, asset.id, path, duration)
            chapter.audio_status = "completed"; db.commit()
            job = update_job(db, job.id, status="completed", progress=100, message="Audio generation completed")
            note = update_notification(db, note.id, status="completed", progress=100, message=job.message)
            recalc_book(db, book_id)
            await broadcast_job(job); await broadcast_notification(note)
        except Exception as exc:
            fail_audio_asset(db, asset.id)
            chapter.audio_status = "failed"; db.commit()
            job = update_job(db, job.id, status="failed", error=str(exc), message="Audio generation failed")
            note = update_notification(db, note.id, status="failed", message=f"Audio generation failed: {exc}")
            await broadcast_job(job); await broadcast_notification(note)
        finally:
            db.close()
    _schedule(run())

def spawn_book_audio(book_id: str, language: str, speaker_id: str, source_text_type: str, accent: str):
    async def run():
        db = SessionLocal()
        job = create_job(db, type="generate_audio_book", scope="book", book_id=book_id, message="Book audio generation queued")
        note = create_notification(db, type="audio", title="Book audio started",
                                   message="Generating audio for all chapters.", status="started",
                                   related_entity_type="book", related_entity_id=book_id)
        await broadcast_job(job); await broadcast_notification(note)
        try:
            chapters = db.query(Chapter).filter(Chapter.book_id == book_id).order_by(Chapter.chapter_number).all()
            total = max(len(chapters), 1)
            for index, chapter in enumerate(chapters, start=1):
                asset, _ = create_audio_asset(db, chapter=chapter, language=language, speaker_id=speaker_id, source_text_type=source_text_type, accent=accent)
                chapter.audio_status = "running"; db.commit()
                text = get_text_for_audio(chapter, source_text_type)
                path, duration = tts_service.synthesize(text, language, accent)
                finalize_audio_asset(db, asset.id, path, duration)
                chapter.audio_status = "completed"; db.commit()
                progress = int(index / total * 100)
                job = update_job(db, job.id, status="running", progress=progress, message=f"Generated chapter {chapter.chapter_number} audio")
                note = update_notification(db, note.id, status="running", progress=progress, message=job.message)
                await broadcast_job(job); await broadcast_notification(note)
            job = update_job(db, job.id, status="completed", progress=100, message="Book audio generation completed")
            note = update_notification(db, note.id, status="completed", progress=100, message=job.message)
            recalc_book(db, book_id)
            await broadcast_job(job); await broadcast_notification(note)
        except Exception as exc:
            job = update_job(db, job.id, status="failed", error=str(exc), message="Book audio generation failed")
            note = update_notification(db, note.id, status="failed", message=f"Book audio generation failed: {exc}")
            await broadcast_job(job); await broadcast_notification(note)
        finally:
            db.close()
    _schedule(run())