import wave
from gtts import gTTS

from app.services.storage_service import build_audio_path
from app.services.speaker_service import resolve_tld
from app.utils.audio import estimate_duration_seconds


class GTTSProvider:
    def synthesize(self, text: str, language: str, accent: str = "indian", speaker: dict | None = None):
        path = build_audio_path(".mp3")
        normalized_language = (language or "en").lower().strip()
        normalized_text = text or "Empty audio"
        tld = resolve_tld(normalized_language, accent, speaker)

        gTTS(
            text=normalized_text,
            lang=normalized_language,
            tld=tld,
            slow=False
        ).save(str(path))

        return str(path), estimate_duration_seconds(normalized_text)


class SilentWaveProvider:
    def synthesize(self, text: str, language: str, accent: str = "indian", speaker: dict | None = None):
        duration = estimate_duration_seconds(text)
        path = build_audio_path(".wav")
        framerate = 22050
        frames = int(duration * framerate)

        with wave.open(str(path), "w") as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(framerate)
            silence = (b"\x00\x00" * frames)
            wav.writeframes(silence)

        return str(path), duration


class TTSService:
    def __init__(self):
        self.primary = GTTSProvider()
        self.fallback = SilentWaveProvider()

    def synthesize(self, text: str, language: str, accent: str = "indian", speaker: dict | None = None):
        try:
            return self.primary.synthesize(
                text=text,
                language=language,
                accent=accent,
                speaker=speaker
            )
        except Exception:
            return self.fallback.synthesize(
                text=text,
                language=language,
                accent=accent,
                speaker=speaker
            )


tts_service = TTSService()