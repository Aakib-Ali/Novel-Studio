from sqlalchemy import String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from .baseModel import TimestampMixin


class AudioAsset(Base, TimestampMixin):
    __tablename__ = "audioassets"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    bookid: Mapped[str] = mapped_column(ForeignKey("books.id"), index=True)
    chapterid: Mapped[str] = mapped_column(ForeignKey("chapters.id"), index=True)

    language: Mapped[str] = mapped_column(String(20), nullable=False)
    voicename: Mapped[str] = mapped_column(String(100), nullable=False)
    accent: Mapped[str] = mapped_column(String(100), nullable=False)
    sourcetexttype: Mapped[str] = mapped_column(String(30), nullable=False)

    filepath: Mapped[str] = mapped_column(String(500), nullable=False)
    duration: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="queued")

    book = relationship("Book", back_populates="audioassets")
    chapter = relationship("Chapter", back_populates="audioassets")