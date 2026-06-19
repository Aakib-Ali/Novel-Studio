from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from .base import TimestampMixin

class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="queued")
    progress: Mapped[int] = mapped_column(Integer, default=0)
    related_entity_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    related_entity_id: Mapped[str | None] = mapped_column(String(100), nullable=True)