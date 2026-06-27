from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.services.event_bus import event_bus
from app.utils.ids import generate_id

def serialize_notification(notification: Notification):
    return {
        "id": notification.id,
        "type": notification.type,
        "title": notification.title,
        "message": notification.message,
        "status": notification.status,
        "progress": notification.progress,
        "related_entity_type": notification.related_entity_type,
        "related_entity_id": notification.related_entity_id,
        "created_at": notification.created_at.isoformat(),
        "updated_at": notification.updated_at.isoformat(),
    }

async def broadcast_notification(notification: Notification):
    await event_bus.publish({"kind": "notification", "payload": serialize_notification(notification)})

def create_notification(
    db: Session,
    *,
    type: str,
    title: str,
    message: str,
    status: str = "completed",
    progress: int = 0,
    related_entity_type: str | None = None,
    related_entity_id: str | None = None,
):
    item = Notification(
        id=generate_id("noti"),
        type=type,
        title=title,
        message=message,
        status=status,
        progress=progress,
        related_entity_type=related_entity_type,
        related_entity_id=related_entity_id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def update_notification(db: Session, notification_id: str, **updates):
    item = db.get(Notification, notification_id)
    if not item:
        return None
    for key, value in updates.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item