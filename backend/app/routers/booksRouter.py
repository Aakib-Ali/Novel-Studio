from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.bookModel import Book
from app.services.bookService import createbook, getbook, listbooks, recalcbook
from app.services.chapterService import createchapter
from app.services.notificationService import broadcastnotification, createnotification

router = APIRouter(prefix="/books", tags=["books"])


@router.get("")
def bookslist(db: Session = Depends(get_db)):
    return listbooks(db)


@router.post("")
async def bookscreate(
    title: str = Form(...),
    author: str = Form(...),
    first_file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    book = createbook(db, title=title, author=author, first_file=first_file)

    note = createnotification(
        db,
        type="book",
        title="Book created",
        message=f"{book.title} was created successfully.",
        status="completed",
        related_entity_type="book",
        related_entity_id=book.id,
    )
    await broadcastnotification(note)
    return getbook(db, book.id)


@router.get("/{book_id}")
def bookdetail(book_id: str, db: Session = Depends(get_db)):
    book = getbook(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.post("/{book_id}/chapters")
async def uploadchapter(
    book_id: str,
    chapter_file: UploadFile = File(...),
    chapter_number: int | None = Form(None),
    title: str | None = Form(None),
    db: Session = Depends(get_db),
):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    chapter = createchapter(
        db,
        book=book,
        chapter_file=chapter_file,
        chapter_number=chapter_number,
        title=title,
    )
    recalcbook(db, book_id)

    note = createnotification(
        db,
        type="chapter",
        title="Chapter uploaded",
        message=f"Chapter {chapter.chapter_number} was added.",
        status="completed",
        related_entity_type="chapter",
        related_entity_id=chapter.id,
    )
    await broadcastnotification(note)
    return getbook(db, book_id)