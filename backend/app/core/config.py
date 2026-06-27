from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASEDIR = Path(__file__).resolve().parent.parent
PROJECTDIR = BASEDIR.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APPNAME: str = "Novel Studio API"
    APIPREFIX: str = "/api"
    DATABASEURL: str = "sqlite:///./novel_studio.db"
    FRONTENDORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    TRANSLATIONPROVIDER: str = "auto"
    TTSPROVIDER: str = "auto"
    TRANSLATETARGETDEFAULT: str = "hi"
    LIBRETRANSLATEURL: str | None = None

    UPLOADSDIR: Path = BASEDIR / "uploads"
    GENERATEDAUDIODIR: Path = BASEDIR / "generated_audio"
    STATICDIR: Path = BASEDIR / "static"

    @property
    def cors_origins(self):
      return [item.strip() for item in self.FRONTENDORIGINS.split(",") if item.strip()]

settings = Settings()
for path in [settings.UPLOADSDIR, settings.GENERATEDAUDIODIR, settings.STATICDIR]:
    path.mkdir(parents=True, exist_ok=True)