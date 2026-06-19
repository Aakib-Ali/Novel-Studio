from pydantic import BaseModel

class JobRead(BaseModel):
    id: str
    type: str
    scope: str
    status: str
    progress: int
    message: str
    error: str | None = None
    book_id: str | None = None
    chapter_id: str | None = None
    audio_asset_id: str | None = None
    created_at: str
    updated_at: str