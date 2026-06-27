from sqlalchemy.orm import Session

from app.models.bookModel import Book
from app.models.chapterModel import Chapter
from app.services.fileparserService import extracttextfromfile
from app.services.serializers import computeworkflowstatus, loadbookwithrelations, serializebook
from app.services.storageService import saveupload
from app.utils.idsUtil import generateid
from app.utils.textUtil import excerpt


def listbooks(db: Session) -> list[dict]:
    books = db.query(Book).order_by(Book.updated_at.desc()).all()
    hydrated = [loadbookwithrelations(db, book.id) for book in books]
    return [serializebook(book) for book in hydrated if book]


def getbook(db: Session, book_id: str) -> dict | None:
    book = loadbookwithrelations(db, book_id)
    return serializebook(book) if book else None


def createbook(db: Session, *, title: str, author: str, first_file) -> Book:
    path = saveupload(first_file)
    extracted = extracttextfromfile(path)

    book = Book(
        id=generateid("book"),
        title=title.strip(),
        author=author.strip(),
        workflow_status="ready",
        summary=excerpt(extracted),
    )
    db.add(book)
    db.flush()

    chapter = Chapter(
        id=generateid("chp"),
        book_id=book.id,
        chapter_number=1,
        title="Chapter 1",
        original_text=extracted,
        translated_text=None,
        replaced_text=None,
        translation_status="not_started",
        replacement_status="not_started",
        audio_status="not_started",
    )
    db.add(chapter)
    db.commit()
    db.refresh(book)
    return book


def recalcbook(db: Session, book_id: str) -> Book | None:
    book = loadbookwithrelations(db, book_id)
    if not book:
        return None

    chapters = list(book.chapters or [])
    if chapters:
        book.summary = excerpt(chapters[0].original_text)

    book.workflow_status = computeworkflowstatus(book)
    db.commit()
    db.refresh(book)
    return book