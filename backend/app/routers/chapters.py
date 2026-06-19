from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.chapter import Chapter
from app.services.book_service import recalc_book, serialize_chapter
from app.services.chapter_service import save_translated_text, save_replaced_text
from app.schemas.chapter import ChapterTextUpdate

router = APIRouter(tags=["chapters"])

@router.get("/chapters/{chapter_id}")
def get_chapter(chapter_id: str, db: Session = Depends(get_db)):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return serialize_chapter(chapter)

@router.put("/chapters/{chapter_id}/translated-text")
def update_translated_text(chapter_id: str, payload: ChapterTextUpdate, db: Session = Depends(get_db)):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    save_translated_text(db, chapter, payload.translated_text or "")
    recalc_book(db, chapter.book_id)
    return serialize_chapter(chapter)

@router.put("/chapters/{chapter_id}/replaced-text")
def update_replaced_text(chapter_id: str, payload: ChapterTextUpdate, db: Session = Depends(get_db)):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    save_replaced_text(db, chapter, payload.replaced_text or "")
    recalc_book(db, chapter.book_id)
    return serialize_chapter(chapter)