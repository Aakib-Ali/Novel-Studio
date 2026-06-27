from typing import Optional

from pydantic import BaseModel


class AudioGenerateRequest(BaseModel):
    language: str = "hi"
    speakerid: str = ""
    sourcetexttype: str = "translated"
    accent: str = "indian"
    emotion: Optional[str] = None
    style: Optional[str] = None
    styledegree: Optional[float] = None
    referenceaudiourl: Optional[str] = None
    clonevoiceid: Optional[str] = None


class AudioAssetRead(BaseModel):
    id: str
    bookid: str
    chapterid: str
    language: str
    voicename: str
    accent: str
    sourcetexttype: str
    filepath: str
    duration: float | None = None
    status: str
    createdat: str
    updatedat: str
    downloadurl: str


class SpeakerRead(BaseModel):
    id: str
    displayname: str
    language: str
    languagecode: str | None = None
    accent: str
    gender: str
    style: str | None = None
    provider: str
    providervoiceid: str
    tld: str | None = None
    supportsemotion: bool = False
    supportscloning: bool = False
    active: bool
    previewurl: str