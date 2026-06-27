from sqlalchemy.orm import Session
from app.models.chapter import Chapter
from app.models.book import Book
from app.services.file_parser import extract_text_from_file
from app.services.storage_service import save_upload
from app.utils.ids import generate_id

def next_chapter_number(book: Book) -> int:
    if not book.chapters:
        return 1
    return max(ch.chapter_number for ch in book.chapters) + 1

def create_chapter(db: Session, book: Book, chapter_file, chapter_number: int | None = None, title: str | None = None):
    path = save_upload(chapter_file)
    extracted = extract_text_from_file(path)
    number = chapter_number or next_chapter_number(book)
    chapter = Chapter(
        id=generate_id("chp"),
        book_id=book.id,
        chapter_number=number,
        title=title or f"Chapter {number}",
        original_text=extracted,
        translation_status="not_started",
        replacement_status="not_started",
        audio_status="not_started"
    )
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter

def save_translated_text(db: Session, chapter: Chapter, translated_text: str):
    chapter.translated_text = translated_text
    chapter.translation_status = "completed" if translated_text else "not_started"
    db.commit()
    db.refresh(chapter)
    return chapter

def save_replaced_text(db: Session, chapter: Chapter, replaced_text: str):
    chapter.replaced_text = replaced_text
    chapter.replacement_status = "completed" if replaced_text else "not_started"
    db.commit()
    db.refresh(chapter)
    return chapter