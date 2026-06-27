import httpx

from app.core.config import settings
from app.utils.textUtil import chunktext


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
        "voice": "आवाज़",
    }

    def translate(self, text: str, targetlanguage: str) -> str:
        if targetlanguage != "hi":
            return text

        result = text
        for src, dst in self.glossary.items():
            result = result.replace(src, dst).replace(src.title(), dst)
        return f"{result}"


class GoogleFreeProvider:
    endpoint = "https://translate.googleapis.com/translate_a/single"

    def translatechunk(self, text: str, targetlanguage: str) -> str:
        response = httpx.get(
            self.endpoint,
            params={
                "client": "gtx",
                "sl": "auto",
                "tl": targetlanguage,
                "dt": "t",
                "q": text,
            },
            timeout=20.0,
        )
        response.raise_for_status()
        data = response.json()
        return "".join(part[0] for part in data[0])

    def translate(self, text: str, targetlanguage: str) -> str:
        return "".join(self.translatechunk(chunk, targetlanguage) for chunk in chunktext(text))


class LibreTranslateProvider:
    def __init__(self, url: str):
        self.url = url.rstrip("/")

    def translate(self, text: str, targetlanguage: str) -> str:
        translated = []
        for chunk in chunktext(text):
            response = httpx.post(
                f"{self.url}/translate",
                json={
                    "q": chunk,
                    "source": "auto",
                    "target": targetlanguage,
                    "format": "text",
                },
                timeout=30.0,
            )
            response.raise_for_status()
            translated.append(response.json()["translatedText"])
        return "".join(translated)


class TranslationService:
    def __init__(self):
        self.dev = DevTranslationProvider()

    def translatetext(self, text: str, targetlanguage: str = "hi") -> str:
        if not text:
            return ""

        if targetlanguage.lower() != "hi":
            return text

        providers = []
        if settings.LIBRETRANSLATEURL:
            providers.append(LibreTranslateProvider(settings.LIBRETRANSLATEURL))
        providers.append(GoogleFreeProvider())
        providers.append(self.dev)

        lasterror = None
        for provider in providers:
            try:
                return provider.translate(text, targetlanguage)
            except Exception as exc:
                lasterror = exc

        if lasterror:
            return self.dev.translate(text, targetlanguage)
        return text


translationservice = TranslationService()