from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.book import Book
from app.models.chapter import Chapter
from app.schemas.chapter import ReplacementRequest
from app.services.job_service import spawn_book_replacement, spawn_chapter_replacement

router = APIRouter(prefix="/replacement", tags=["replacement"])

@router.post("/books/{book_id}")
def replace_book(book_id: str, payload: ReplacementRequest, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    spawn_book_replacement(book_id, [r.model_dump() for r in payload.replacements], payload.source_text_type)
    return {"message": "Book replacement job started"}

@router.post("/chapters/{chapter_id}")
def replace_chapter(chapter_id: str, payload: ReplacementRequest, db: Session = Depends(get_db)):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    spawn_chapter_replacement(chapter.book_id, chapter_id, [r.model_dump() for r in payload.replacements], payload.source_text_type)
    return {"message": "Chapter replacement job started"}