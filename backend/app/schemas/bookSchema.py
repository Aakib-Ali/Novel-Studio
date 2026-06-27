from pydantic import BaseModel

from .chapterSchema import ChapterRead


class TranslationRequest(BaseModel):
    targetlanguage: str = "hi"


class BookRead(BaseModel):
    id: str
    title: str
    author: str
    workflowstatus: str
    summary: str | None = None
    chapterscount: int
    translatedcount: int
    replacedcount: int
    audiocount: int
    createdat: str
    updatedat: str
    chapters: list[ChapterRead]