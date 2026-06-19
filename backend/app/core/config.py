from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BASE_DIR.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "Novel Studio API"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = "sqlite:///./novel_studio.db"
    FRONTEND_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    TRANSLATION_PROVIDER: str = "auto"
    TTS_PROVIDER: str = "auto"
    TRANSLATE_TARGET_DEFAULT: str = "hi"
    LIBRETRANSLATE_URL: str | None = None

    UPLOADS_DIR: Path = BASE_DIR / "uploads"
    GENERATED_AUDIO_DIR: Path = BASE_DIR / "generated_audio"
    STATIC_DIR: Path = BASE_DIR / "static"

    @property
    def cors_origins(self):
      return [item.strip() for item in self.FRONTEND_ORIGINS.split(",") if item.strip()]

settings = Settings()
for path in [settings.UPLOADS_DIR, settings.GENERATED_AUDIO_DIR, settings.STATIC_DIR]:
    path.mkdir(parents=True, exist_ok=True)