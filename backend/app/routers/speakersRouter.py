from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.core.config import settings
from app.services.speakerService import getspeaker, listspeakers
from app.services.ttsService import ttsservice

router = APIRouter(prefix="/speakers", tags=["speakers"])


@router.get("")
def speakers():
    return listspeakers("/api")


@router.get("/{speakerid}/preview")
def speakerpreview(speakerid: str):
    speaker = getspeaker(speakerid, "/api")

    previewdir = settings.GENERATEDAUDIODIR / "previews"
    previewdir.mkdir(parents=True, exist_ok=True)
    path = previewdir / f"{speakerid}.mp3"

    if not path.exists():
        sampletext = "नमस्ते, यह हिंदी वॉइस प्रीव्यू है।" if speaker["language"] == "hi" else "Hello, this is your Indian English voice preview."
        generatedpath, _ = ttsservice.synthesize(
            text=sampletext,
            language=speaker["language"],
            accent=speaker["accent"],
            speaker=speaker,
        )
        src = Path(generatedpath)
        path.write_bytes(src.read_bytes())

    if not path.exists():
        raise HTTPException(status_code=404, detail="Preview unavailable")

    return FileResponse(path, media_type="audio/mpeg", filename=path.name)