import asyncio
import logging
from collections.abc import Awaitable
from typing import Any

logger = logging.getLogger(__name__)


class TaskRunnerService:
    def __init__(self):
        self.tasks: dict[str, asyncio.Task] = {}

    def _cleanup(self, task_id: str):
        self.tasks.pop(task_id, None)

    def run(self, task_id: str, coroutine: Awaitable[Any]) -> asyncio.Task:
        existing = self.tasks.get(task_id)
        if existing and not existing.done():
            logger.info("Task already running for task_id=%s", task_id)
            return existing

        task = asyncio.create_task(coroutine, name=task_id)
        self.tasks[task_id] = task

        def _done_callback(done_task: asyncio.Task):
            try:
                done_task.result()
                logger.info("Task completed: %s", task_id)
            except asyncio.CancelledError:
                logger.warning("Task cancelled: %s", task_id)
            except Exception as exc:
                logger.exception("Task failed: %s error=%s", task_id, exc)
            finally:
                self._cleanup(task_id)

        task.add_done_callback(_done_callback)
        logger.info("Task started: %s", task_id)
        return task

    def get(self, task_id: str) -> asyncio.Task | None:
        return self.tasks.get(task_id)

    def is_running(self, task_id: str) -> bool:
        task = self.tasks.get(task_id)
        return bool(task and not task.done())

    def cancel(self, task_id: str) -> bool:
        task = self.tasks.get(task_id)
        if not task or task.done():
            return False
        task.cancel()
        return True

    def list_running(self) -> list[dict]:
        items = []
        for task_id, task in self.tasks.items():
            items.append(
                {
                    "taskid": task_id,
                    "done": task.done(),
                    "cancelled": task.cancelled(),
                }
            )
        return items


taskrunnerService = TaskRunnerService()


def make_task_id(prefix: str, *parts: str | None) -> str:
    clean_parts = [prefix] + [str(part) for part in parts if part]
    return ":".join(clean_parts)