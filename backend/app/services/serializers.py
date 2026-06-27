from sqlalchemy.orm import Session, selectinload

from app.models.bookModel import Book
from app.models.chapterModel import Chapter
from app.models.jobModel import Job
from app.models.notificationModel import Notification
from app.services.audioService import serializeaudioasset
from app.utils.textUtil import excerpt


def serializechapter(chapter: Chapter, apiprefix: str = "/api") -> dict:
    assets = sorted(
        chapter.audio_assets or [],
        key=lambda item: item.created_at,
        reverse=True,
    )

    return {
        "id": chapter.id,
        "book_id": chapter.book_id,
        "chapter_number": chapter.chapter_number,
        "title": chapter.title,
        "original_text": chapter.original_text,
        "translated_text": chapter.translated_text,
        "replaced_text": chapter.replaced_text,
        "translation_status": chapter.translation_status,
        "replacement_status": chapter.replacement_status,
        "audio_status": chapter.audio_status,
        "created_at": chapter.created_at.isoformat() if chapter.created_at else None,
        "updated_at": chapter.updated_at.isoformat() if chapter.updated_at else None,
        "audio_assets": [serializeaudioasset(asset, apiprefix) for asset in assets],
    }


def computeworkflowstatus(book: Book) -> str:
    chapters = list(book.chapters or [])

    if not chapters:
        return "empty"

    if any(
        chapter.audio_status == "running"
        or chapter.translation_status == "running"
        or chapter.replacement_status == "running"
        for chapter in chapters
    ):
        return "processing"

    if all((chapter.audio_assets or []) for chapter in chapters):
        return "audio_ready"

    if all(chapter.translated_text for chapter in chapters):
        return "translated"

    return "ready"


def serializebook(book: Book, apiprefix: str = "/api") -> dict:
    chapters = list(book.chapters or [])
    translated_count = sum(1 for chapter in chapters if chapter.translated_text)
    replaced_count = sum(1 for chapter in chapters if chapter.replaced_text)
    audio_count = sum(len(chapter.audio_assets or []) for chapter in chapters)

    return {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "workflow_status": computeworkflowstatus(book),
        "summary": book.summary or (excerpt(chapters[0].original_text) if chapters else ""),
        "chapters_count": len(chapters),
        "translated_count": translated_count,
        "replaced_count": replaced_count,
        "audio_count": audio_count,
        "created_at": book.created_at.isoformat() if book.created_at else None,
        "updated_at": book.updated_at.isoformat() if book.updated_at else None,
        "chapters": [serializechapter(chapter, apiprefix) for chapter in chapters],
    }


def serializejob(job: Job) -> dict:
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
        "created_at": job.created_at.isoformat() if job.created_at else None,
        "updated_at": job.updated_at.isoformat() if job.updated_at else None,
    }


def serializenotification(notification: Notification) -> dict:
    return {
        "id": notification.id,
        "type": notification.type,
        "title": notification.title,
        "message": notification.message,
        "status": notification.status,
        "progress": notification.progress,
        "related_entity_type": notification.related_entity_type,
        "related_entity_id": notification.related_entity_id,
        "created_at": notification.created_at.isoformat() if notification.created_at else None,
        "updated_at": notification.updated_at.isoformat() if notification.updated_at else None,
    }


def loadbookwithrelations(db: Session, book_id: str) -> Book | None:
    return (
        db.query(Book)
        .options(selectinload(Book.chapters).selectinload(Chapter.audio_assets))
        .filter(Book.id == book_id)
        .first()
    )