from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.core.config import settings
from app.services.speaker_service import get_speaker, list_speakers
from app.services.tts_service import tts_service

router = APIRouter(prefix="/speakers", tags=["speakers"])


@router.get("")
def speakers():
    return list_speakers("/api")


@router.get("/{speaker_id}/preview")
def speaker_preview(speaker_id: str):
    speaker = get_speaker(speaker_id, "/api")
    preview_dir = settings.GENERATED_AUDIO_DIR / "previews"
    preview_dir.mkdir(parents=True, exist_ok=True)

    path = preview_dir / f"{speaker_id}.mp3"
    if not path.exists():
        sample_text = (
            "नमस्ते, यह आपकी हिंदी भारतीय आवाज़ का प्रीव्यू है।"
            if speaker["language"] == "hi"
            else "Hello, this is your Indian English voice preview."
        )

        generated_path, _ = tts_service.synthesize(
            text=sample_text,
            language=speaker["language"],
            accent=speaker["accent"],
            speaker=speaker
        )
        src = Path(generated_path)
        path.write_bytes(src.read_bytes())

    if not path.exists():
        raise HTTPException(status_code=404, detail="Preview unavailable")

    return FileResponse(path, media_type="audio/mpeg", filename=path.name)