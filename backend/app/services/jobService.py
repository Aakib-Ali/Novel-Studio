import asyncio

from app.core.database import SessionLocal
from app.models.chapterModel import Chapter
from app.services.audioService import createaudioasset, failaudioasset, finalizeaudioasset, gettextforaudio
from app.services.bookService import recalcbook
from app.services.notificationService import broadcastnotification, createnotification, updatenotification
from app.services.replacementService import applyreplacements
from app.services.translationService import translationservice
from app.services.ttsService import synthesizespeech
from app.utils.idsUtil import generateid

from sqlalchemy.orm import Session

from app.models.jobModel import Job


ACTIVE_STATUSES = {"queued", "running"}


def list_jobs(
    db: Session,
    book_id: str | None = None,
    chapter_id: str | None = None,
    active_only: bool = False,
):
    query = db.query(Job)

    if book_id:
        query = query.filter(Job.book_id == book_id)

    if chapter_id:
        query = query.filter(Job.chapter_id == chapter_id)

    if active_only:
        query = query.filter(Job.status.in_(ACTIVE_STATUSES))

    return query.order_by(Job.updated_at.desc()).all()


def get_job(db: Session, job_id: str):
    return db.query(Job).filter(Job.id == job_id).first()

def createjob(
    db,
    jobtype: str,
    scope: str,
    bookid: str | None = None,
    chapterid: str | None = None,
    audioassetid: str | None = None,
    message: str = "Queued",
):
    job = Job(
        id=generateid("job"),
        type=jobtype,
        scope=scope,
        status="queued",
        progress=0,
        message=message,
        bookid=bookid,
        chapterid=chapterid,
        audioassetid=audioassetid,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def serializejob(job: Job):
    return {
        "id": job.id,
        "type": job.type,
        "scope": job.scope,
        "status": job.status,
        "progress": job.progress,
        "message": job.message,
        "error": job.error,
        "bookid": job.bookid,
        "chapterid": job.chapterid,
        "audioassetid": job.audioassetid,
        "createdat": job.createdat.isoformat() if job.createdat else None,
        "updatedat": job.updatedat.isoformat() if job.updatedat else None,
    }


def listjobs(db, bookid: str | None = None, activeonly: bool = False):
    query = db.query(Job)
    if bookid:
        query = query.filter(Job.bookid == bookid)
    if activeonly:
        query = query.filter(Job.status.in_(["queued", "running"]))
    jobs = query.order_by(Job.createdat.desc()).all()
    return [serializejob(job) for job in jobs]


async def _emitjobnotification(db, title: str, message: str, status: str, progress: int, relatedentitytype: str, relatedentityid: str):
    note = createnotification(
        db,
        type="job",
        title=title,
        message=message,
        status=status,
        progress=progress,
        relatedentitytype=relatedentitytype,
        relatedentityid=relatedentityid,
    )
    await broadcastnotification(note)
    return note


async def runchaptertranslation(bookid: str, chapterid: str, targetlanguage: str):
    db = SessionLocal()
    job = None
    note = None
    try:
        chapter = db.get(Chapter, chapterid)
        if not chapter:
            raise ValueError("Chapter not found")

        job = createjob(
            db,
            jobtype="translatechapter",
            scope="chapter",
            bookid=bookid,
            chapterid=chapterid,
            message="Chapter translation started",
        )
        chapter.translation_status = "running"
        job.status = "running"
        job.progress = 25
        db.commit()

        note = await _emitjobnotification(
            db,
            title="Translation started",
            message=f"Chapter {chapter.chapter_number} translation is running.",
            status="running",
            progress=25,
            relatedentitytype="chapter",
            relatedentityid=chapter.id,
        )

        chapter.translated_text = translationservice.translatetext(chapter.original_text, targetlanguage)
        chapter.translation_status = "completed"
        job.status = "completed"
        job.progress = 100
        job.message = "Chapter translation completed"
        db.commit()

        if note:
            updated = updatenotification(
                db,
                note.id,
                {"status": "completed", "progress": 100, "message": f"Chapter {chapter.chapter_number} translation completed."},
            )
            await broadcastnotification(updated)

        recalcbook(db, bookid)
    except Exception as exc:
        if job:
            job.status = "failed"
            job.message = "Chapter translation failed"
            job.error = str(exc)
        chapter = db.get(Chapter, chapterid)
        if chapter:
            chapter.translation_status = "failed"
        db.commit()

        if note:
            updated = updatenotification(
                db,
                note.id,
                {"status": "failed", "message": f"Chapter translation failed: {exc}"},
            )
            if updated:
                await broadcastnotification(updated)
    finally:
        db.close()


async def runbooktranslation(bookid: str, targetlanguage: str):
    print("RUNBOOK START", bookid, targetlanguage)
    db = SessionLocal()
    job = None
    note = None
    try:
        chapters = db.query(Chapter).filter(Chapter.book_id == bookid).order_by(Chapter.chapter_number).all()
        print("FOUND CHAPTERS", len(chapters))

        total = max(len(chapters), 1)

        job = createjob(
            db,
            jobtype="translatebook",
            scope="book",
            bookid=bookid,
            message="Book translation started",
        )
        print("JOB CREATED", job.id)

        job.status = "running"
        db.commit()

        for index, chapter in enumerate(chapters, start=1):
            print("TRANSLATING CHAPTER", chapter.id)
            chapter.translation_status = "running"
            db.commit()

            chapter.translated_text = translationservice.translatetext(chapter.original_text, targetlanguage)
            print("TRANSLATED TEXT LENGTH", len(chapter.translated_text or ""))

            chapter.translation_status = "completed"
            job.progress = int(index / total * 100)
            job.message = f"Translated chapter {chapter.chapter_number}"
            db.commit()

        job.status = "completed"
        job.progress = 100
        job.message = "Book translation completed"
        db.commit()
        print("RUNBOOK DONE")

        recalcbook(db, bookid)
    except Exception as exc:
        print("RUNBOOK ERROR", repr(exc))
        if job:
            job.status = "failed"
            job.message = "Book translation failed"
            job.error = str(exc)
        db.commit()
    finally:
        db.close()
        print("RUNBOOK CLOSED")

async def runchapterreplacement(bookid: str, chapterid: str, replacements: list[dict], sourcetexttype: str):
    db = SessionLocal()
    job = None
    note = None
    try:
        job = createjob(
            db,
            jobtype="replacechapter",
            scope="chapter",
            bookid=bookid,
            chapterid=chapterid,
            message="Chapter replacement started",
        )
        chapter = db.get(Chapter, chapterid)
        if not chapter:
            raise ValueError("Chapter not found")

        job.status = "running"
        chapter.replacement_status = "running"
        db.commit()

        note = await _emitjobnotification(
            db,
            title="Replacement started",
            message=f"Chapter {chapter.chapter_number} replacement is running.",
            status="running",
            progress=25,
            relatedentitytype="chapter",
            relatedentityid=chapter.id,
        )

        if sourcetexttype == "original":
            sourcetext = chapter.original_text or ""
        elif sourcetexttype == "replaced":
            sourcetext = chapter.replaced_text or chapter.translated_text or ""
        else:
            sourcetext = chapter.translated_text or chapter.replaced_text or ""

        chapter.replaced_text = applyreplacements(sourcetext, replacements)
        chapter.replacement_status = "completed"
        job.status = "completed"
        job.progress = 100
        job.message = "Chapter replacement completed"
        db.commit()

        if note:
            updated = updatenotification(
                db,
                note.id,
                {"status": "completed", "progress": 100, "message": f"Chapter {chapter.chapter_number} replacement completed."},
            )
            await broadcastnotification(updated)

        recalcbook(db, bookid)
    except Exception as exc:
        if job:
            job.status = "failed"
            job.message = "Chapter replacement failed"
            job.error = str(exc)
        chapter = db.get(Chapter, chapterid)
        if chapter:
            chapter.replacement_status = "failed"
        db.commit()

        if note:
            updated = updatenotification(
                db,
                note.id,
                {"status": "failed", "message": f"Chapter replacement failed: {exc}"},
            )
            if updated:
                await broadcastnotification(updated)
    finally:
        db.close()


async def runbookreplacement(bookid: str, replacements: list[dict], sourcetexttype: str):
    db = SessionLocal()
    job = None
    note = None
    try:
        job = createjob(
            db,
            jobtype="replacebook",
            scope="book",
            bookid=bookid,
            message="Book replacement started",
        )
        chapters = db.query(Chapter).filter(Chapter.book_id == bookid).order_by(Chapter.chapter_number).all()
        total = max(len(chapters), 1)
        job.status = "running"
        db.commit()

        note = await _emitjobnotification(
            db,
            title="Book replacement started",
            message="Bulk replacement is running across the book.",
            status="running",
            progress=0,
            relatedentitytype="book",
            relatedentityid=bookid,
        )

        for index, chapter in enumerate(chapters, start=1):
            chapter.replacement_status = "running"
            db.commit()

            if sourcetexttype == "original":
                sourcetext = chapter.original_text or ""
            elif sourcetexttype == "replaced":
                sourcetext = chapter.replaced_text or chapter.translated_text or ""
            else:
                sourcetext = chapter.translated_text or chapter.replaced_text or ""

            chapter.replaced_text = applyreplacements(sourcetext, replacements)
            chapter.replacement_status = "completed"

            job.progress = int(index / total * 100)
            job.message = f"Processed chapter {chapter.chapter_number}"
            db.commit()

            if note:
                updated = updatenotification(
                    db,
                    note.id,
                    {
                        "status": "running",
                        "progress": job.progress,
                        "message": f"Processed chapter {chapter.chapter_number}.",
                    },
                )
                await broadcastnotification(updated)

        job.status = "completed"
        job.progress = 100
        job.message = "Book replacement completed"
        db.commit()

        if note:
            updated = updatenotification(
                db,
                note.id,
                {"status": "completed", "progress": 100, "message": "Book replacement completed."},
            )
            await broadcastnotification(updated)

        recalcbook(db, bookid)
    except Exception as exc:
        if job:
            job.status = "failed"
            job.message = "Book replacement failed"
            job.error = str(exc)
        db.commit()

        if note:
            updated = updatenotification(
                db,
                note.id,
                {"status": "failed", "message": f"Book replacement failed: {exc}"},
            )
            if updated:
                await broadcastnotification(updated)
    finally:
        db.close()

async def runchapteraudio(bookid: str, chapterid: str, language: str, speakerid: str | None, sourcetexttype: str, accent: str | None):
    print("RUNCHAPTERAUDIO START", bookid, chapterid, language, speakerid, sourcetexttype, accent)
    db = SessionLocal()
    job = None
    asset = None
    note = None
    try:
        chapter = db.get(Chapter, chapterid)
        print("CHAPTER FOUND", bool(chapter))
        if not chapter:
            raise ValueError("Chapter not found")

        asset, speaker = createaudioasset(
            db,
            chapter=chapter,
            language=language,
            speakerid=speakerid,
            sourcetexttype=sourcetexttype,
            accent=accent,
        )
        print("AUDIO ASSET CREATED", asset.id, speaker)

        job = createjob(
            db,
            jobtype="generateaudiochapter",
            scope="audio",
            bookid=bookid,
            chapterid=chapterid,
            audioassetid=asset.id,
            message="Chapter audio generation started",
        )
        print("JOB CREATED", job.id)

        chapter.audio_status = "running"
        job.status = "running"
        job.progress = 25
        db.commit()

        text = gettextforaudio(chapter, sourcetexttype)
        print("TEXT LENGTH", len(text or ""))

        filepath, duration = synthesizespeech(
            text=text,
            language=language,
            speakerid=speakerid,
            accent=accent,
        )
        print("TTS OUTPUT", filepath, duration)

        finalizeaudioasset(db, asset.id, filepath, duration)
        print("ASSET FINALIZED", asset.id)

        chapter.audio_status = "completed"
        job.status = "completed"
        job.progress = 100
        job.message = "Chapter audio generation completed"
        db.commit()
        print("RUNCHAPTERAUDIO DONE")

        recalcbook(db, bookid)
    except Exception as exc:
        print("RUNCHAPTERAUDIO ERROR", repr(exc))
        if asset:
            failaudioasset(db, asset.id)
        if job:
            job.status = "failed"
            job.message = "Chapter audio generation failed"
            job.error = str(exc)
        chapter = db.get(Chapter, chapterid)
        if chapter:
            chapter.audio_status = "failed"
        db.commit()
    finally:
        db.close()
        print("RUNCHAPTERAUDIO CLOSED")



async def runbookaudio(bookid: str, language: str, speakerid: str | None, sourcetexttype: str, accent: str | None):
    db = SessionLocal()
    job = None
    note = None
    try:
        chapters = db.query(Chapter).filter(Chapter.book_id == bookid).order_by(Chapter.chapter_number).all()
        total = max(len(chapters), 1)

        job = createjob(
            db,
            jobtype="generateaudiobook",
            scope="book",
            bookid=bookid,
            message="Book audio generation started",
        )
        job.status = "running"
        db.commit()

        note = await _emitjobnotification(
            db,
            title="Book audio generation started",
            message="Multi-chapter audio generation is running.",
            status="running",
            progress=0,
            relatedentitytype="book",
            relatedentityid=bookid,
        )

        for index, chapter in enumerate(chapters, start=1):
            asset, speaker = createaudioasset(
                db,
                chapter=chapter,
                language=language,
                speakerid=speakerid,
                sourcetexttype=sourcetexttype,
                accent=accent,
            )
            chapter.audio_status = "running"
            db.commit()

            text = gettextforaudio(chapter, sourcetexttype)
            filepath, duration = synthesizespeech(
                text=text,
                language=language,
                speakerid=speakerid,
                accent=accent,
            )
            finalizeaudioasset(db, asset.id, filepath, duration)

            chapter.audio_status = "completed"
            job.progress = int(index / total * 100)
            job.message = f"Generated audio for chapter {chapter.chapter_number}"
            db.commit()

            if note:
                updated = updatenotification(
                    db,
                    note.id,
                    {
                        "status": "running",
                        "progress": job.progress,
                        "message": f"Generated audio for chapter {chapter.chapter_number}.",
                    },
                )
                await broadcastnotification(updated)

        job.status = "completed"
        job.progress = 100
        job.message = "Book audio generation completed"
        db.commit()

        if note:
            updated = updatenotification(
                db,
                note.id,
                {"status": "completed", "progress": 100, "message": "Book audio generation completed."},
            )
            await broadcastnotification(updated)

        recalcbook(db, bookid)

    except Exception as exc:
        if job:
            job.status = "failed"
            job.message = "Book audio generation failed"
            job.error = str(exc)
        db.commit()

        if note:
            updated = updatenotification(
                db,
                note.id,
                {"status": "failed", "message": f"Book audio generation failed: {exc}"},
            )
            if updated:
                await broadcastnotification(updated)
    finally:
        db.close()


def spawnchaptertranslation(bookid: str, chapterid: str, targetlanguage: str):
    asyncio.create_task(runchaptertranslation(bookid, chapterid, targetlanguage))


def spawnbooktranslation(bookid: str, targetlanguage: str):
    asyncio.create_task(runbooktranslation(bookid, targetlanguage))


def spawnchapterreplacement(bookid: str, chapterid: str, replacements: list[dict], sourcetexttype: str):
    asyncio.create_task(runchapterreplacement(bookid, chapterid, replacements, sourcetexttype))


def spawnbookreplacement(bookid: str, replacements: list[dict], sourcetexttype: str):
    asyncio.create_task(runbookreplacement(bookid, replacements, sourcetexttype))


def spawnchapteraudio(bookid: str, chapterid: str, language: str, speakerid: str | None, sourcetexttype: str, accent: str | None = None):
    asyncio.create_task(runchapteraudio(bookid, chapterid, language, speakerid, sourcetexttype, accent))


def spawnbookaudio(bookid: str, language: str, speakerid: str | None, sourcetexttype: str, accent: str | None = None):
    asyncio.create_task(runbookaudio(bookid, language, speakerid, sourcetexttype, accent))

def runbooktranslationtask(bookid: str, targetlanguage: str):
    asyncio.run(runbooktranslation(bookid, targetlanguage))


def runchaptertranslationtask(bookid: str, chapterid: str, targetlanguage: str):
    asyncio.run(runchaptertranslation(bookid, chapterid, targetlanguage))