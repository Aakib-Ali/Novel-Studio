from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.notification import Notification
from app.services.notification_service import serialize_notification

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("")
def notifications(limit: int = Query(default=50, le=200), db: Session = Depends(get_db)):
    items = db.query(Notification).order_by(Notification.updated_at.desc()).limit(limit).all()
    return [serialize_notification(item) for item in items]