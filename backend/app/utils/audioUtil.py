def estimatedurationseconds(text: str) -> float:
    words = max(len((text or "").split()), 1)
    return round(max(2.0, words / 2.5), 2)