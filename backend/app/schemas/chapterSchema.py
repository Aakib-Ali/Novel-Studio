from pydantic import BaseModel

from .audioSchema import AudioAssetRead


class ChapterTextUpdate(BaseModel):
    translatedtext: str | None = None
    replacedtext: str | None = None


class ReplacementRule(BaseModel):
    find: str
    replacewith: str


class ReplacementRequest(BaseModel):
    replacements: list[ReplacementRule]
    sourcetexttype: str = "translated"


class ChapterRead(BaseModel):
    id: str
    bookid: str
    chapternumber: int
    title: str | None = None
    originaltext: str
    translatedtext: str | None = None
    replacedtext: str | None = None
    translationstatus: str
    replacementstatus: str
    audiostatus: str
    createdat: str
    updatedat: str
    audioassets: list[AudioAssetRead]