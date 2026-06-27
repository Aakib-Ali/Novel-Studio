import httpx
from app.core.config import settings
from app.utils.text import chunk_text

class DevTranslationProvider:
    glossary = {
        "chapter": "अध्याय",
        "book": "पुस्तक",
        "author": "लेखक",
        "name": "नाम",
        "city": "शहर",
        "friend": "मित्र",
        "hello": "नमस्ते",
        "story": "कहानी",
        "voice": "आवाज़"
    }

    def translate(self, text: str, target_language: str) -> str:
        if target_language != "hi":
            return text
        result = text
        for src, dst in self.glossary.items():
            result = result.replace(src, dst).replace(src.title(), dst)
        return f"अनुवादित पाठ:\n{result}"

class GoogleFreeProvider:
    endpoint = "https://translate.googleapis.com/translate_a/single"

    def translate_chunk(self, text: str, target_language: str) -> str:
        response = httpx.get(
            self.endpoint,
            params={"client": "gtx", "sl": "auto", "tl": target_language, "dt": "t", "q": text},
            timeout=20.0
        )
        response.raise_for_status()
        data = response.json()
        return "".join(part[0] for part in data[0])

    def translate(self, text: str, target_language: str) -> str:
        return "\n".join(self.translate_chunk(chunk, target_language) for chunk in chunk_text(text))

class LibreTranslateProvider:
    def __init__(self, url: str):
        self.url = url.rstrip("/")

    def translate(self, text: str, target_language: str) -> str:
        translated = []
        for chunk in chunk_text(text):
            response = httpx.post(
                f"{self.url}/translate",
                json={"q": chunk, "source": "auto", "target": target_language, "format": "text"},
                timeout=30.0
            )
            response.raise_for_status()
            translated.append(response.json()["translatedText"])
        return "\n".join(translated)

class TranslationService:
    def __init__(self):
        self.dev = DevTranslationProvider()

    def translate_text(self, text: str, target_language: str = "hi") -> str:
        providers = []
        if settings.LIBRETRANSLATE_URL:
            providers.append(LibreTranslateProvider(settings.LIBRETRANSLATE_URL))
        providers.append(GoogleFreeProvider())
        providers.append(self.dev)

        last_error = None
        for provider in providers:
            try:
                return provider.translate(text, target_language)
            except Exception as exc:
                last_error = exc
        if last_error:
            return self.dev.translate(text, target_language)
        return text

translation_service = TranslationService()