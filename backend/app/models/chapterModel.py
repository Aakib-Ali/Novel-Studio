from sqlalchemy import String, Text, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from .base import TimestampMixin

class Chapter(Base, TimestampMixin):
    __tablename__ = "chapters"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    book_id: Mapped[str] = mapped_column(ForeignKey("books.id"), index=True)
    chapter_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)

    original_text: Mapped[str] = mapped_column(Text, nullable=False)
    translated_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    replaced_text: Mapped[str | None] = mapped_column(Text, nullable=True)

    translation_status: Mapped[str] = mapped_column(String(50), default="not_started")
    replacement_status: Mapped[str] = mapped_column(String(50), default="not_started")
    audio_status: Mapped[str] = mapped_column(String(50), default="not_started")

    book = relationship("Book", back_populates="chapters")
    audio_assets = relationship("AudioAsset", back_populates="chapter", cascade="all, delete-orphan")