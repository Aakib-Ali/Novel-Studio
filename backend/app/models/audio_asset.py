from sqlalchemy import String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from .base import TimestampMixin

class AudioAsset(Base, TimestampMixin):
    __tablename__ = "audio_assets"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    book_id: Mapped[str] = mapped_column(ForeignKey("books.id"), index=True)
    chapter_id: Mapped[str] = mapped_column(ForeignKey("chapters.id"), index=True)
    language: Mapped[str] = mapped_column(String(20), nullable=False)
    voice_name: Mapped[str] = mapped_column(String(100), nullable=False)
    accent: Mapped[str] = mapped_column(String(100), nullable=False)
    source_text_type: Mapped[str] = mapped_column(String(30), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    duration: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="queued")

    book = relationship("Book", back_populates="audio_assets")
    chapter = relationship("Chapter", back_populates="audio_assets")