from pydantic import BaseModel
from typing import Optional, Literal


class AudioGenerateRequest(BaseModel):
    language: str = "hi"
    speaker_id: str
    source_text_type: str = "translated"
    accent: str = "indian"
    emotion: Optional[str] = None
    style: Optional[str] = None
    style_degree: Optional[float] = None
    reference_audio_url: Optional[str] = None
    clone_voice_id: Optional[str] = None


class AudioAssetRead(BaseModel):
    id: str
    book_id: str
    chapter_id: str
    language: str
    voice_name: str
    accent: str
    source_text_type: str
    file_path: str
    duration: float | None = None
    status: str
    created_at: str
    updated_at: str
    download_url: str


class SpeakerRead(BaseModel):
    id: str
    display_name: str
    language: str
    language_code: str | None = None
    accent: str
    gender: str
    style: str | None = None
    provider: str
    provider_voice_id: str
    tld: str | None = None
    supports_emotion: bool = False
    supports_cloning: bool = False
    active: bool
    preview_url: str