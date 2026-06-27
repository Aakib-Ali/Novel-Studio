import asyncio
import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.services.eventbusService import eventbus

router = APIRouter(prefix="/stream", tags=["stream"])


@router.get("/events")
async def streamevents():
    async def eventgenerator():
        queue = eventbus.subscribe()
        try:
            while True:
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=15)
                    yield f"data: {json.dumps(event)}\n\n"
                except asyncio.TimeoutError:
                    yield "event: ping\ndata: {}\n\n"
        finally:
            eventbus.unsubscribe(queue)

    return StreamingResponse(
        eventgenerator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )