from pydantic import BaseModel


class JobRead(BaseModel):
    id: str
    type: str
    scope: str
    status: str
    progress: int
    message: str
    error: str | None = None
    bookid: str | None = None
    chapterid: str | None = None
    audioassetid: str | None = None
    createdat: str
    updatedat: str