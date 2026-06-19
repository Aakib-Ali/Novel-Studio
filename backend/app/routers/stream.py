import asyncio
import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.event_bus import event_bus

router = APIRouter(prefix="/stream", tags=["stream"])

@router.get("/events")
async def stream_events():
    async def event_generator():
        queue = event_bus.subscribe()
        try:
            while True:
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=15)
                    yield f"data: {json.dumps(event)}\n\n"
                except asyncio.TimeoutError:
                    yield "event: ping\ndata: {}\n\n"
        finally:
            event_bus.unsubscribe(queue)

    return StreamingResponse(event_generator(),media_type="text/event-stream",headers={"Cache-Control": "no-cache","Connection": "keep-alive","X-Accel-Buffering": "no",},)