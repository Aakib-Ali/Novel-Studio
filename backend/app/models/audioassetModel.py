from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Float, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class AudioAsset(Base):
    __tablename__ = "audioassets"

    id = Column(String, primary_key=True, index=True)
    book_id = Column(String, ForeignKey("books.id"), nullable=False, index=True)
    chapter_id = Column(String, ForeignKey("chapters.id"), nullable=False, index=True)

    language = Column(String, nullable=False)
    voice_name = Column(String, nullable=False)
    accent = Column(String, nullable=True)
    source_text_type = Column(String, nullable=False)

    file_path = Column(String, nullable=False)
    status = Column(String, default="queued", nullable=False)
    duration_seconds = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    book = relationship("Book", back_populates="audio_assets")
    chapter = relationship("Chapter", back_populates="audio_assets")