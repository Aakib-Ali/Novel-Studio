from fastapi import FastAPI
from app.core.config import settings
from app.core.cors import configure_cors
from app.core.database import Base, engine
from app.core.logging import configure_logging
from app.models import book, chapter, audio_asset, job, notification  # noqa
from app.routers import health, books, chapters, translation, replacement, audio, speakers, jobs, notifications, stream

configure_logging()
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)
configure_cors(app)

app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(books.router, prefix=settings.API_PREFIX)
app.include_router(chapters.router, prefix=settings.API_PREFIX)
app.include_router(translation.router, prefix=settings.API_PREFIX)
app.include_router(replacement.router, prefix=settings.API_PREFIX)
app.include_router(audio.router, prefix=settings.API_PREFIX)
app.include_router(speakers.router, prefix=settings.API_PREFIX)
app.include_router(jobs.router, prefix=settings.API_PREFIX)
app.include_router(notifications.router, prefix=settings.API_PREFIX)
app.include_router(stream.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {"message": "Novel Studio API"}