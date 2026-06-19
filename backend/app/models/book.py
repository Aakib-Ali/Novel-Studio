from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from .base import TimestampMixin

class Book(Base, TimestampMixin):
    __tablename__ = "books"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    workflow_status: Mapped[str] = mapped_column(String(50), default="ready")
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    chapters = relationship("Chapter", back_populates="book", cascade="all, delete-orphan", order_by="Chapter.chapter_number")
    audio_assets = relationship("AudioAsset", back_populates="book", cascade="all, delete-orphan")