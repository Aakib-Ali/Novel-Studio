from pydantic import BaseModel


class NotificationRead(BaseModel):
    id: str
    type: str
    title: str
    message: str
    status: str
    progress: int
    relatedentitytype: str | None = None
    relatedentityid: str | None = None
    createdat: str
    updatedat: str