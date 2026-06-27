from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.chapterModel import Chapter
from app.schemas.chapterSchema import ChapterTextUpdate
from app.services.bookService import recalcbook
from app.services.chapterService import savereplacedtext, savetranslatedtext
from app.services.serializers import serializechapter

router = APIRouter(tags=["chapters"])


@router.get("/chapters/{chapter_id}")
def getchapter(chapter_id: str, db: Session = Depends(get_db)):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return serializechapter(chapter)


@router.put("/chapters/{chapter_id}/translated-text")
def updatetranslatedtext(
    chapter_id: str,
    payload: ChapterTextUpdate,
    db: Session = Depends(get_db),
):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    savetranslatedtext(db, chapter, payload.translated_text or "")
    recalcbook(db, chapter.book_id)
    return serializechapter(chapter)


@router.put("/chapters/{chapter_id}/replaced-text")
def updatereplacedtext(
    chapter_id: str,
    payload: ChapterTextUpdate,
    db: Session = Depends(get_db),
):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    savereplacedtext(db, chapter, payload.replaced_text or "")
    recalcbook(db, chapter.book_id)
    return serializechapter(chapter)