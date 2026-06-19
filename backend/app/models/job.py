from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from .base import TimestampMixin

class Job(Base, TimestampMixin):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    scope: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="queued")
    progress: Mapped[int] = mapped_column(Integer, default=0)
    message: Mapped[str] = mapped_column(String(500), default="")
    error: Mapped[str | None] = mapped_column(Text, nullable=True)

    book_id: Mapped[str | None] = mapped_column(ForeignKey("books.id"), nullable=True)
    chapter_id: Mapped[str | None] = mapped_column(ForeignKey("chapters.id"), nullable=True)
    audio_asset_id: Mapped[str | None] = mapped_column(ForeignKey("audio_assets.id"), nullable=True)