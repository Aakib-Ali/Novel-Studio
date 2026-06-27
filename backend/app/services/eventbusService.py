import asyncio


class EventBus:
    def __init__(self):
        self.subscribers: set[asyncio.Queue] = set()

    def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self.subscribers.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue) -> None:
        self.subscribers.discard(queue)

    async def publish(self, payload: dict) -> None:
        for queue in list(self.subscribers):
            await queue.put(payload)


eventbus = EventBus()