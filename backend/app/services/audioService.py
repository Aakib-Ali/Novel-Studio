from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.audioassetModel import AudioAsset
from app.models.chapterModel import Chapter
from app.services.speakerService import getdefaultspeakerforlanguage, getspeaker
from app.utils.idsUtil import generateid


def gettextforaudio(chapter: Chapter, sourcetexttype: str) -> str:
    mapping = {
        "original": chapter.original_text,
        "translated": chapter.translated_text or "",
        "replaced": chapter.replaced_text or "",
    }
    text = mapping.get(sourcetexttype)
    if not text:
        raise HTTPException(status_code=400, detail=f"No {sourcetexttype} text available for this chapter.")
    return text


def createaudioasset(
    db: Session,
    chapter: Chapter,
    language: str,
    speakerid: str | None,
    sourcetexttype: str,
    accent: str | None,
):
    speaker = getspeaker(speakerid) if speakerid else getdefaultspeakerforlanguage(language)
    finalaccent = accent or speaker["accent"]

    asset = AudioAsset(
        id=generateid("audio"),
        book_id=chapter.book_id,
        chapter_id=chapter.id,
        language=language,
        voice_name=speaker["displayname"],
        accent=finalaccent,
        source_text_type=sourcetexttype,
        file_path="",
        duration_seconds=None,
        status="queued",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset, speaker

def finalizeaudioasset(
    db: Session,
    assetid: str,
    filepath: str,
    duration: float,
    status: str = "completed",
):
    asset = db.get(AudioAsset, assetid)
    if not asset:
        raise HTTPException(status_code=404, detail="Audio asset not found")

    asset.file_path = filepath
    asset.duration_seconds = duration
    asset.status = status
    db.commit()
    db.refresh(asset)
    return asset


def failaudioasset(db: Session, assetid: str):
    asset = db.get(AudioAsset, assetid)
    if asset:
        asset.status = "failed"
        db.commit()
        db.refresh(asset)
    return asset


def serializeaudioasset(asset: AudioAsset, apiprefix: str = "/api"):
    return {
        "id": asset.id,
        "book_id": asset.book_id,
        "chapter_id": asset.chapter_id,
        "language": asset.language,
        "voice_name": asset.voice_name,
        "accent": asset.accent,
        "source_text_type": asset.source_text_type,
        "file_path": asset.file_path,
        "duration_seconds": asset.duration_seconds,
        "status": asset.status,
        "created_at": asset.created_at.isoformat() if asset.created_at else None,
        "download_url": f"{apiprefix}/audio/assets/{asset.id}/download",
    }