from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.audioassetModel import AudioAsset
from app.models.bookModel import Book
from app.models.chapterModel import Chapter
from app.schemas.audioSchema import AudioGenerateRequest
from app.services.audioService import serializeaudioasset
from app.services.jobService import spawnbookaudio, spawnchapteraudio

router = APIRouter(prefix="/audio", tags=["audio"])

@router.post("/books/{bookid}")
async def generate_book_audio(
    bookid: str,
    payload: AudioGenerateRequest,
    db: Session = Depends(get_db),
):
    book = db.get(Book, bookid)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    spawnbookaudio(
        bookid=bookid,
        language=payload.language,
        speakerid=payload.speakerid,
        sourcetexttype=payload.sourcetexttype,
        accent=payload.accent,
    )
    return {"message": "Book audio generation job started"}

@router.post("/chapters/{chapterid}")
async def generate_chapter_audio(
    chapterid: str,
    payload: AudioGenerateRequest,
    db: Session = Depends(get_db),
):
    chapter = db.get(Chapter, chapterid)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    spawnchapteraudio(
        bookid=chapter.book_id,
        chapterid=chapterid,
        language=payload.language,
        speakerid=payload.speakerid,
        sourcetexttype=payload.sourcetexttype,
        accent=payload.accent,
    )
    return {"message": "Chapter audio generation job started"}


@router.get("/chapters/{chapter_id}")
def list_chapter_audio(
    chapter_id: str,
    db: Session = Depends(get_db),
):
    assets = (
        db.query(AudioAsset)
        .filter(AudioAsset.chapter_id == chapter_id)
        .order_by(AudioAsset.created_at.desc())
        .all()
    )
    return [serializeaudioasset(asset) for asset in assets]


@router.get("/assets/{asset_id}/download")
def download_audio(
    asset_id: str,
    db: Session = Depends(get_db),
):
    asset = db.get(AudioAsset, asset_id)
    if not asset or not asset.file_path:
        raise HTTPException(status_code=404, detail="Audio asset not found")

    path = Path(asset.file_path)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Audio file missing")

    media_type = "audio/mpeg" if path.suffix.lower() == ".mp3" else "audio/wav"
    return FileResponse(path, media_type=media_type, filename=path.name)