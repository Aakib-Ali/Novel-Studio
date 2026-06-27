from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.bookModel import Book
from app.models.chapterModel import Chapter
from app.schemas.bookSchema import TranslationRequest
from app.services.jobService import runbooktranslationtask, runchaptertranslationtask

router = APIRouter(prefix="/translation", tags=["translation"])


@router.post("/books/{bookid}")
async def translatebook(
    bookid: str,
    payload: TranslationRequest,
    backgroundtasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    book = db.get(Book, bookid)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    backgroundtasks.add_task(runbooktranslationtask, bookid, payload.targetlanguage)
    return {"message": "Book translation job started"}


@router.post("/chapters/{chapterid}")
async def translatechapter(
    chapterid: str,
    payload: TranslationRequest,
    backgroundtasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    chapter = db.get(Chapter, chapterid)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    backgroundtasks.add_task(
        runchaptertranslationtask,
        chapter.bookid,
        chapterid,
        payload.targetlanguage,
    )
    return {"message": "Chapter translation job started"}