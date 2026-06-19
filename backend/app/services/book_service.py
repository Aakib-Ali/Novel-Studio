from sqlalchemy.orm import Session, selectinload
from app.models.book import Book
from app.models.chapter import Chapter
from app.services.audio_service import serialize_audio_asset
from app.services.file_parser import extract_text_from_file
from app.services.storage_service import save_upload
from app.utils.ids import generate_id
from app.utils.text import excerpt

def compute_workflow_status(book: Book) -> str:
    chapters = book.chapters or []
    if not chapters:
        return "empty"
    if any(c.audio_status == "running" or c.translation_status == "running" or c.replacement_status == "running" for c in chapters):
        return "processing"
    if all(c.audio_assets for c in chapters):
        return "audio_ready"
    if all(c.translated_text for c in chapters):
        return "translated"
    return "ready"

def serialize_chapter(chapter: Chapter, api_prefix: str = "/api"):
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
        "created_at": chapter.created_at.isoformat(),
        "updated_at": chapter.updated_at.isoformat(),
        "audio_assets": [serialize_audio_asset(a, api_prefix) for a in sorted(chapter.audio_assets, key=lambda x: x.created_at, reverse=True)],
    }

def serialize_book(book: Book, api_prefix: str = "/api"):
    chapters = list(book.chapters or [])
    translated_count = sum(1 for c in chapters if c.translated_text)
    replaced_count = sum(1 for c in chapters if c.replaced_text)
    audio_count = sum(len(c.audio_assets or []) for c in chapters)
    return {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "workflow_status": compute_workflow_status(book),
        "summary": book.summary or (excerpt(chapters[0].original_text) if chapters else ""),
        "chapters_count": len(chapters),
        "translated_count": translated_count,
        "replaced_count": replaced_count,
        "audio_count": audio_count,
        "created_at": book.created_at.isoformat(),
        "updated_at": book.updated_at.isoformat(),
        "chapters": [serialize_chapter(c, api_prefix) for c in chapters],
    }

def recalc_book(db: Session, book_id: str):
    book = db.query(Book).options(selectinload(Book.chapters).selectinload(Chapter.audio_assets)).filter(Book.id == book_id).first()
    if not book:
        return None
    book.workflow_status = compute_workflow_status(book)
    if book.chapters:
        book.summary = excerpt(book.chapters[0].original_text)
    db.commit()
    db.refresh(book)
    return book

def list_books(db: Session):
    books = db.query(Book).options(selectinload(Book.chapters).selectinload(Chapter.audio_assets)).order_by(Book.updated_at.desc()).all()
    return [serialize_book(book) for book in books]

def get_book(db: Session, book_id: str):
    book = db.query(Book).options(selectinload(Book.chapters).selectinload(Chapter.audio_assets)).filter(Book.id == book_id).first()
    return serialize_book(book) if book else None

def create_book(db: Session, title: str, author: str, first_file):
    path = save_upload(first_file)
    extracted = extract_text_from_file(path)
    book = Book(id=generate_id("book"), title=title, author=author, workflow_status="ready", summary=excerpt(extracted))
    db.add(book)
    db.flush()

    chapter = Chapter(
        id=generate_id("chp"),
        book_id=book.id,
        chapter_number=1,
        title="Chapter 1",
        original_text=extracted,
        translation_status="not_started",
        replacement_status="not_started",
        audio_status="not_started"
    )
    db.add(chapter)
    db.commit()
    db.refresh(book)
    return book