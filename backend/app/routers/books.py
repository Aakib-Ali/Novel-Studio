from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.book import Book
from app.services.book_service import create_book, get_book, list_books, recalc_book
from app.services.chapter_service import create_chapter
from app.services.notification_service import create_notification, broadcast_notification

router = APIRouter(prefix="/books", tags=["books"])

@router.get("")
def books_list(db: Session = Depends(get_db)):
    return list_books(db)

@router.post("")
async def books_create(
    title: str = Form(...),
    author: str = Form(...),
    first_file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    book = create_book(db, title=title, author=author, first_file=first_file)
    note = create_notification(db, type="book", title="Book created", message=f"{book.title} was created successfully.",
                               status="completed", related_entity_type="book", related_entity_id=book.id)
    await broadcast_notification(note)
    return get_book(db, book.id)

@router.get("/{book_id}")
def book_detail(book_id: str, db: Session = Depends(get_db)):
    book = get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("/{book_id}/chapters")
async def upload_chapter(
    book_id: str,
    chapter_file: UploadFile = File(...),
    chapter_number: int | None = Form(None),
    title: str | None = Form(None),
    db: Session = Depends(get_db),
):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    chapter = create_chapter(db, book, chapter_file=chapter_file, chapter_number=chapter_number, title=title)
    recalc_book(db, book_id)
    note = create_notification(db, type="chapter", title="Chapter uploaded",
                               message=f"Chapter {chapter.chapter_number} was added.", status="completed",
                               related_entity_type="chapter", related_entity_id=chapter.id)
    await broadcast_notification(note)
    return get_book(db, book_id)