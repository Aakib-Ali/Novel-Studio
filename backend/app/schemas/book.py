from pydantic import BaseModel
from .chapter import ChapterRead

class TranslationRequest(BaseModel):
    target_language: str = "hi"

class BookRead(BaseModel):
    id: str
    title: str
    author: str
    workflow_status: str
    summary: str | None = None
    chapters_count: int
    translated_count: int
    replaced_count: int
    audio_count: int
    created_at: str
    updated_at: str
    chapters: list[ChapterRead] = []