from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.utils.timestampsUtil import utcnow


class TimestampMixin:
    createdat: Mapped[DateTime] = mapped_column("created_at", DateTime(timezone=True), default=utcnow)
    updatedat: Mapped[DateTime] = mapped_column("updated_at", DateTime(timezone=True), default=utcnow, onupdate=utcnow)