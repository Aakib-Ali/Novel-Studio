from fastapi import HTTPException


def listspeakers(apiprefix: str = "/api"):
    return [
        {
            "id": "hifemalea",
            "displayname": "Hindi Female A",
            "language": "hi",
            "languagecode": "hi-IN",
            "accent": "indian",
            "gender": "female",
            "style": "editorial",
            "provider": "gtts",
            "providervoiceid": "hi-india-female-a",
            "tld": "co.in",
            "supportsemotion": False,
            "supportscloning": False,
            "active": True,
            "previewurl": f"{apiprefix}/speakers/hifemalea/preview",
        },
        {
            "id": "himaleb",
            "displayname": "Hindi Male B",
            "language": "hi",
            "languagecode": "hi-IN",
            "accent": "indian",
            "gender": "male",
            "style": "clear",
            "provider": "gtts",
            "providervoiceid": "hi-india-male-b",
            "tld": "co.in",
            "supportsemotion": False,
            "supportscloning": False,
            "active": True,
            "previewurl": f"{apiprefix}/speakers/himaleb/preview",
        },
        {
            "id": "envoicec",
            "displayname": "English Voice C",
            "language": "en",
            "languagecode": "en-IN",
            "accent": "global",
            "gender": "female",
            "style": "studio",
            "provider": "gtts",
            "providervoiceid": "en-global-female-c",
            "tld": "com",
            "supportsemotion": False,
            "supportscloning": False,
            "active": True,
            "previewurl": f"{apiprefix}/speakers/envoicec/preview",
        },
        {
            "id": "envoiced",
            "displayname": "English Voice D",
            "language": "en",
            "languagecode": "en-IN",
            "accent": "neutral",
            "gender": "male",
            "style": "narrative",
            "provider": "gtts",
            "providervoiceid": "en-neutral-male-d",
            "tld": "com",
            "supportsemotion": False,
            "supportscloning": False,
            "active": True,
            "previewurl": f"{apiprefix}/speakers/envoiced/preview",
        },
    ]


def getspeaker(speakerid: str, apiprefix: str = "/api"):
    speaker = next((item for item in listspeakers(apiprefix) if item["id"] == speakerid), None)
    if not speaker:
        raise HTTPException(status_code=404, detail="Speaker not found")
    return speaker


def getdefaultspeakerforlanguage(language: str, apiprefix: str = "/api"):
    speakers = [item for item in listspeakers(apiprefix) if item["language"] == language and item["active"]]
    if not speakers:
        raise HTTPException(status_code=404, detail=f"No active speaker found for language {language}")

    indianvoice = next((item for item in speakers if item.get("accent") == "indian"), None)
    return indianvoice or speakers[0]


def resolvetld(language: str, accent: str | None = None) -> str:
    language = (language or "en").lower()
    accent = (accent or "").lower()

    if language == "hi":
        return "co.in"
    if accent in {"indian", "india", "in"}:
        return "co.in"
    if accent in {"uk", "british", "gb"}:
        return "co.uk"
    if accent in {"australian", "au"}:
        return "com.au"
    if accent in {"american", "us"}:
        return "com"
    return "com"