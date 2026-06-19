from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime
from app.core.database import Base
from app.utils.timestamps import utcnow

class TimestampMixin:
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)