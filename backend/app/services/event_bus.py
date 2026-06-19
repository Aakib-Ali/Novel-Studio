import asyncio

class EventBus:
    def __init__(self):
        self._subscribers: set[asyncio.Queue] = set()

    def subscribe(self):
        queue = asyncio.Queue()
        self._subscribers.add(queue)
        return queue

    def unsubscribe(self, queue):
        self._subscribers.discard(queue)

    async def publish(self, payload: dict):
        for queue in list(self._subscribers):
            await queue.put(payload)

event_bus = EventBus()