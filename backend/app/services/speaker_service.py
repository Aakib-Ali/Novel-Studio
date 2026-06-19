from typing import Optional


def list_speakers(api_prefix: str = "/api"):
    speakers = [
        {
            "id": "hi_indian_primary",
            "display_name": "Hindi Indian Narration",
            "language": "hi",
            "language_code": "hi-IN",
            "accent": "indian",
            "gender": "neutral",
            "style": "editorial",
            "provider": "gtts",
            "provider_voice_id": "gtts-hi-co-in",
            "tld": "co.in",
            "active": True,
            "preview_url": f"{api_prefix}/speakers/hi_indian_primary/preview"
        },
        {
            "id": "en_indian_primary",
            "display_name": "English Indian Narration",
            "language": "en",
            "language_code": "en-IN",
            "accent": "indian",
            "gender": "neutral",
            "style": "narrative",
            "provider": "gtts",
            "provider_voice_id": "gtts-en-co-in",
            "tld": "co.in",
            "active": True,
            "preview_url": f"{api_prefix}/speakers/en_indian_primary/preview"
        },
        {
            "id": "en_global_fallback",
            "display_name": "English Global Fallback",
            "language": "en",
            "language_code": "en-US",
            "accent": "global",
            "gender": "neutral",
            "style": "standard",
            "provider": "gtts",
            "provider_voice_id": "gtts-en-com",
            "tld": "com",
            "active": True,
            "preview_url": f"{api_prefix}/speakers/en_global_fallback/preview"
        }
    ]
    return speakers


def get_speaker(speaker_id: str, api_prefix: str = "/api"):
    speaker = next((s for s in list_speakers(api_prefix) if s["id"] == speaker_id), None)
    if not speaker:
        raise ValueError("Speaker not found")
    return speaker


def get_default_speaker_for_language(language: str, api_prefix: str = "/api"):
    normalized = (language or "").lower().strip()

    if normalized == "hi":
        return get_speaker("hi_indian_primary", api_prefix)

    if normalized == "en":
        return get_speaker("en_indian_primary", api_prefix)

    return get_speaker("en_global_fallback", api_prefix)


def resolve_tld(language: str, accent: Optional[str] = None, speaker: Optional[dict] = None) -> str:
    if speaker and speaker.get("tld"):
        return speaker["tld"]

    normalized_language = (language or "").lower().strip()
    normalized_accent = (accent or "").lower().strip()

    if normalized_language == "hi":
        return "co.in"

    if normalized_language == "en" and normalized_accent == "indian":
        return "co.in"

    return "com"