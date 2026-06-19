from pydantic import BaseModel

class NotificationRead(BaseModel):
    id: str
    type: str
    title: str
    message: str
    status: str
    progress: int
    related_entity_type: str | None = None
    related_entity_id: str | None = None
    created_at: str
    updated_at: str