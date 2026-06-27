from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.bookModel import Book
from app.models.chapterModel import Chapter
from app.schemas.chapterSchema import ReplacementRequest
from app.services.jobService import spawnbookreplacement, spawnchapterreplacement

router = APIRouter(prefix="/replacement", tags=["replacement"])


@router.post("/books/{book_id}")
def replacebook(
    book_id: str,
    payload: ReplacementRequest,
    db: Session = Depends(get_db),
):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    spawnbookreplacement(
        book_id,
        [rule.model_dump() for rule in payload.replacements],
        payload.source_text_type,
    )
    return {"message": "Book replacement job started"}


@router.post("/chapters/{chapter_id}")
def replacechapter(
    chapter_id: str,
    payload: ReplacementRequest,
    db: Session = Depends(get_db),
):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    spawnchapterreplacement(
        chapter.book_id,
        chapter_id,
        [rule.model_dump() for rule in payload.replacements],
        payload.source_text_type,
    )
    return {"message": "Chapter replacement job started"}