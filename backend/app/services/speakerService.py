from fastapi import HTTPException


def list_speakers(api_prefix: str = "/api"):
    return [
        {
            "id": "hi_female_a",
            "display_name": "Hindi Female A",
            "language": "hi",
            "accent": "indian",
            "gender": "female",
            "style": "editorial",
            "active": True,
            "preview_url": f"{api_prefix}/speakers/hi_female_a/preview",
        },
        {
            "id": "hi_male_b",
            "display_name": "Hindi Male B",
            "language": "hi",
            "accent": "indian",
            "gender": "male",
            "style": "clear",
            "active": True,
            "preview_url": f"{api_prefix}/speakers/hi_male_b/preview",
        },
        {
            "id": "en_voice_c",
            "display_name": "English Voice C",
            "language": "en",
            "accent": "global",
            "gender": "female",
            "style": "studio",
            "active": True,
            "preview_url": f"{api_prefix}/speakers/en_voice_c/preview",
        },
        {
            "id": "en_voice_d",
            "display_name": "English Voice D",
            "language": "en",
            "accent": "neutral",
            "gender": "male",
            "style": "narrative",
            "active": True,
            "preview_url": f"{api_prefix}/speakers/en_voice_d/preview",
        },
    ]


def get_speaker(speaker_id: str, api_prefix: str = "/api"):
    speaker = next(
        (item for item in list_speakers(api_prefix) if item["id"] == speaker_id),
        None,
    )
    if not speaker:
        raise HTTPException(status_code=404, detail="Speaker not found")
    return speaker


def get_default_speaker_for_language(language: str, api_prefix: str = "/api"):
    speakers = [
        item
        for item in list_speakers(api_prefix)
        if item["language"] == language and item["active"]
    ]

    if not speakers:
        raise HTTPException(
            status_code=404,
            detail=f"No active speaker found for language: {language}",
        )

    indian_voice = next(
        (item for item in speakers if item.get("accent") == "indian"),
        None,
    )

    return indian_voice or speakers[0]