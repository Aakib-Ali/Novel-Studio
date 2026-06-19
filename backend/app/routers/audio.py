from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.book import Book
from app.models.chapter import Chapter
from app.models.audio_asset import AudioAsset
from app.schemas.audio import AudioGenerateRequest
from app.services.audio_service import serialize_audio_asset
from app.services.job_service import spawn_book_audio, spawn_chapter_audio

router = APIRouter(prefix="/audio", tags=["audio"])

@router.post("/books/{book_id}")
async def generate_book_audio(book_id: str, payload: AudioGenerateRequest, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    spawn_book_audio(
        book_id,
        payload.language,
        payload.speaker_id,
        payload.source_text_type,
        payload.accent
    )
    return {"message": "Book audio generation job started"}

@router.post("/chapters/{chapter_id}")
async def generate_chapter_audio(chapter_id: str, payload: AudioGenerateRequest, db: Session = Depends(get_db)):
    chapter = db.get(Chapter, chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    spawn_chapter_audio(
        chapter.book_id,
        chapter_id,
        payload.language,
        payload.speaker_id,
        payload.source_text_type,
        payload.accent
    )
    return {"message": "Chapter audio generation job started"}

@router.get("/chapters/{chapter_id}")
def list_chapter_audio(chapter_id: str, db: Session = Depends(get_db)):
    assets = db.query(AudioAsset).filter(AudioAsset.chapter_id == chapter_id).order_by(AudioAsset.created_at.desc()).all()
    return [serialize_audio_asset(asset) for asset in assets]


@router.get("/assets/{asset_id}/download")
def download_audio(asset_id: str, db: Session = Depends(get_db)):
    asset = db.get(AudioAsset, asset_id)
    if not asset or not asset.file_path:
        raise HTTPException(status_code=404, detail="Audio asset not found")

    path = Path(asset.file_path)
    print("AUDIO DOWNLOAD PATH:", path)
    print("AUDIO EXISTS:", path.exists())

    if not path.exists():
        raise HTTPException(status_code=404, detail="Audio file missing")

    media_type = "audio/mpeg" if path.suffix.lower() == ".mp3" else "audio/wav"
    return FileResponse(path, media_type=media_type, filename=path.name)