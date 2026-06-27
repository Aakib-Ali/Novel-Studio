from sqlalchemy.orm import Session

from app.models.notificationModel import Notification
from app.utils.idsUtil import generateid

subscribers = []


def serializenotification(notification: Notification) -> dict:
    created_at = getattr(notification, "created_at", None) or getattr(notification, "createdat", None)
    updated_at = getattr(notification, "updated_at", None) or getattr(notification, "updatedat", None)

    return {
        "id": notification.id,
        "type": notification.type,
        "title": notification.title,
        "message": notification.message,
        "status": notification.status,
        "progress": notification.progress,
        "related_entity_type": getattr(notification, "related_entity_type", None) or getattr(notification, "relatedentitytype", None),
        "related_entity_id": getattr(notification, "related_entity_id", None) or getattr(notification, "relatedentityid", None),
        "created_at": created_at.isoformat() if created_at else None,
        "updated_at": updated_at.isoformat() if updated_at else None,
    }


def createnotification(
    db: Session,
    *,
    type: str,
    title: str,
    message: str,
    status: str = "queued",
    progress: int = 0,
    related_entity_type: str | None = None,
    related_entity_id: str | None = None,
) -> Notification:
    note = Notification(
        id=generateid("ntf"),
        type=type,
        title=title,
        message=message,
        status=status,
        progress=progress,
        related_entity_type=related_entity_type,
        related_entity_id=related_entity_id,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def updatenotification(
    db: Session,
    notification_id: str,
    *,
    title: str | None = None,
    message: str | None = None,
    status: str | None = None,
    progress: int | None = None,
) -> Notification | None:
    note = db.get(Notification, notification_id)
    if not note:
        return None

    if title is not None:
        note.title = title
    if message is not None:
        note.message = message
    if status is not None:
        note.status = status
    if progress is not None:
        note.progress = progress

    db.commit()
    db.refresh(note)
    return note


async def broadcastnotification(notification: Notification):
    payload = {
        "kind": "notification",
        "payload": serializenotification(notification),
    }

    dead = []
    for queue in subscribers:
        try:
            await queue.put(payload)
        except Exception:
            dead.append(queue)

    for queue in dead:
        if queue in subscribers:
            subscribers.remove(queue)