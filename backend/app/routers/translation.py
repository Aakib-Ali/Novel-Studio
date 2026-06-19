from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.book import Book
from app.models.chapter import Chapter
from app.schemas.book import TranslationRequest
from app.services.job_service import spawn_book_translation, spawn_chapter_translation

router = APIRouter(prefix="/translation", tags=["translation"])

@router.post("/books/{book_id}")
async def translate_book(book_id: str, payload: TranslationRequest, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    spawn_book_translation(book_id, payload.target_language)
    return {"message": "Book translation job started"}

@router.post("/chapters/{chapter_id}")
async def translate_chapter(chapter_id: str, payload: TranslationRequest, db: Session = Depends(get_db)):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    spawn_chapter_translation(chapter.book_id, chapter_id, payload.target_language)
    return {"message": "Chapter translation job started"}