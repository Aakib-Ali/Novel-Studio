from pathlib import Path
from fastapi import UploadFile
from app.core.config import settings
from app.utils.ids import generate_id

def save_upload(file: UploadFile) -> Path:
    suffix = Path(file.filename).suffix or ".bin"
    name = f"{generate_id('upload')}{suffix}"
    destination = settings.UPLOADS_DIR / name
    with destination.open("wb") as f:
        f.write(file.file.read())
    return destination

def build_audio_path(extension: str = ".mp3") -> Path:
    return settings.GENERATED_AUDIO_DIR / f"{generate_id('audio')}{extension}"