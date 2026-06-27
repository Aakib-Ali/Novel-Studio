from pydantic import BaseModel
from .audio import AudioAssetRead

class ChapterTextUpdate(BaseModel):
    translated_text: str | None = None
    replaced_text: str | None = None

class ReplacementRule(BaseModel):
    find: str
    replace_with: str

class ReplacementRequest(BaseModel):
    replacements: list[ReplacementRule]
    source_text_type: str = "translated"

class ChapterRead(BaseModel):
    id: str
    book_id: str
    chapter_number: int
    title: str | None = None
    original_text: str
    translated_text: str | None = None
    replaced_text: str | None = None
    translation_status: str
    replacement_status: str
    audio_status: str
    created_at: str
    updated_at: str
    audio_assets: list[AudioAssetRead] = []