from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.notificationModel import Notification
from app.services.notificationService import serializenotification

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def notifications(
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
):
    items = (
        db.query(Notification)
        .order_by(Notification.updatedat.desc())
        .limit(limit)
        .all()
    )
    return [serializenotification(item) for item in items]