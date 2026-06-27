from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings
from app.utils.idsUtil import generateid


def saveupload(file: UploadFile) -> Path:
    suffix = Path(file.filename or "").suffix or ".bin"
    name = f"{generateid('upload')}{suffix}"
    destination = settings.UPLOADSDIR / name

    with destination.open("wb") as f:
        f.write(file.file.read())

    return destination


def buildaudiopath(extension: str = ".mp3") -> Path:
    return settings.GENERATEDAUDIODIR / f"{generateid('audio')}{extension}"