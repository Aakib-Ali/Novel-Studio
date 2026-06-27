from fastapi import FastAPI

from app.core.config import settings
from app.core.cors import configure_cors
from app.core.database import Base, engine
from app.core.logging import configurelogging
from app.models import bookModel, chapterModel, audioassetModel, jobModel, notificationModel  # noqa: F401
from app.routers import (
    audioRouter,
    booksRouter,
    chaptersRouter,
    healthRouter,
    jobsRouter,
    notificationsRouter,
    replacementRouter,
    speakersRouter,
    streamRouter,
    translationRouter,
)

configurelogging()
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APPNAME)

configure_cors(app)

app.include_router(healthRouter.router, prefix=settings.APIPREFIX)
app.include_router(booksRouter.router, prefix=settings.APIPREFIX)
app.include_router(chaptersRouter.router, prefix=settings.APIPREFIX)
app.include_router(translationRouter.router, prefix=settings.APIPREFIX)
app.include_router(replacementRouter.router, prefix=settings.APIPREFIX)
app.include_router(audioRouter.router, prefix=settings.APIPREFIX)
app.include_router(speakersRouter.router, prefix=settings.APIPREFIX)
app.include_router(jobsRouter.router, prefix=settings.APIPREFIX)
app.include_router(notificationsRouter.router, prefix=settings.APIPREFIX)
app.include_router(streamRouter.router, prefix=settings.APIPREFIX)


@app.get("/")
def root():
    return {"message": "Novel Studio API"}