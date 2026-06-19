def estimate_duration_seconds(text: str) -> float:
    words = max(len((text or "").split()), 1)
    return round(max(2, words / 2.5), 2)