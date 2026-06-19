from pydantic import BaseModel

class AudioGenerateRequest(BaseModel):
    language: str = "hi"
    speaker_id: str
    source_text_type: str = "translated"
    accent: str = "indian"

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
    accent: str
    gender: str
    style: str
    active: bool
    preview_url: str