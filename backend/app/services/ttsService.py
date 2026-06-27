import wave

from gtts import gTTS

from app.services.speakerService import getdefaultspeakerforlanguage, getspeaker, resolvetld
from app.services.storageService import buildaudiopath
from app.utils.audioUtil import estimatedurationseconds


class GTTSProvider:
    def synthesize(self, text: str, language: str, accent: str = "indian", speaker: dict | None = None):
        path = buildaudiopath(".mp3")
        normalizedlanguage = (language or "en").lower().strip()
        normalizedtext = text or "Empty audio"
        tld = resolvetld(normalizedlanguage, accent)

        gTTS(
            text=normalizedtext,
            lang=normalizedlanguage,
            tld=tld,
            slow=False,
        ).save(str(path))

        return str(path), estimatedurationseconds(normalizedtext)


class SilentWaveProvider:
    def synthesize(self, text: str, language: str, accent: str = "indian", speaker: dict | None = None):
        duration = estimatedurationseconds(text)
        path = buildaudiopath(".wav")
        framerate = 22050
        frames = int(duration * framerate)

        with wave.open(str(path), "w") as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(framerate)
            silence = b"\x00\x00" * frames
            wav.writeframes(silence)

        return str(path), duration


class TTSService:
    def __init__(self):
        self.primary = GTTSProvider()
        self.fallback = SilentWaveProvider()

    def synthesize(self, text: str, language: str, accent: str = "indian", speaker: dict | None = None):
        try:
            return self.primary.synthesize(text=text, language=language, accent=accent, speaker=speaker)
        except Exception:
            return self.fallback.synthesize(text=text, language=language, accent=accent, speaker=speaker)


ttsservice = TTSService()


def synthesizespeech(text: str, language: str, speakerid: str | None = None, accent: str | None = None):
    speaker = getspeaker(speakerid) if speakerid else getdefaultspeakerforlanguage(language)
    return ttsservice.synthesize(
        text=text,
        language=language,
        accent=accent or speaker.get("accent", "indian"),
        speaker=speaker,
    )