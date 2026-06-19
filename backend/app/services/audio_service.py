from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.audio_asset import AudioAsset
from app.models.chapter import Chapter
from app.services.speaker_service import get_default_speaker_for_language, get_speaker
from app.utils.ids import generate_id


def get_text_for_audio(chapter: Chapter, source_text_type: str) -> str:
    mapping = {
        "original": chapter.original_text,
        "translated": chapter.translated_text or "",
        "replaced": chapter.replaced_text or "",
    }
    text = mapping.get(source_text_type)
    if not text:
        raise HTTPException(
            status_code=400,
            detail=f"No {source_text_type} text available for this chapter."
        )
    return text


def create_audio_asset(
    db: Session,
    *,
    chapter: Chapter,
    language: str,
    speaker_id: str | None,
    source_text_type: str,
    accent: str | None
):
    if speaker_id:
        speaker = get_speaker(speaker_id)
    else:
        speaker = get_default_speaker_for_language(language)

    final_accent = accent or speaker["accent"]

    asset = AudioAsset(
        id=generate_id("audio"),
        book_id=chapter.book_id,
        chapter_id=chapter.id,
        language=language,
        voice_name=speaker["display_name"],
        accent=final_accent,
        source_text_type=source_text_type,
        file_path="",
        duration=None,
        status="queued",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset, speaker


def finalize_audio_asset(
    db: Session,
    asset_id: str,
    file_path: str,
    duration: float,
    status: str = "completed"
):
    asset = db.get(AudioAsset, asset_id)
    asset.file_path = file_path
    asset.duration = duration
    asset.status = status
    db.commit()
    db.refresh(asset)
    return asset


def fail_audio_asset(db: Session, asset_id: str):
    asset = db.get(AudioAsset, asset_id)
    if asset:
        asset.status = "failed"
        db.commit()
        db.refresh(asset)
    return asset


def serialize_audio_asset(asset: AudioAsset, api_prefix: str = "/api"):
    return {
        "id": asset.id,
        "book_id": asset.book_id,
        "chapter_id": asset.chapter_id,
        "language": asset.language,
        "voice_name": asset.voice_name,
        "accent": asset.accent,
        "source_text_type": asset.source_text_type,
        "file_path": asset.file_path,
        "duration": asset.duration,
        "status": asset.status,
        "created_at": asset.created_at.isoformat(),
        "updated_at": asset.updated_at.isoformat(),
        "download_url": f"{api_prefix}/audio/assets/{asset.id}/download",
    }