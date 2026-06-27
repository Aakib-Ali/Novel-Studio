from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(String, primary_key=True, index=True)
    book_id = Column(String, ForeignKey("books.id"), nullable=False, index=True)
    chapter_number = Column(Integer, nullable=False)
    title = Column(String, nullable=True)

    original_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=True)
    replaced_text = Column(Text, nullable=True)

    translation_status = Column(String, default="pending", nullable=False)
    replacement_status = Column(String, default="pending", nullable=False)
    audio_status = Column(String, default="pending", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    book = relationship("Book", back_populates="chapters")

    audio_assets = relationship(
        "AudioAsset",
        back_populates="chapter",
        cascade="all, delete-orphan",
    )