import re


def excerpt(text: str | None, limit: int = 220) -> str:
    if not text:
        return ""
    normalized = re.sub(r"\s+", " ", text.strip())
    return f"{normalized[:limit]}..." if len(normalized) > limit else normalized


def chunktext(text: str, size: int = 3000) -> list[str]:
    text = text or ""
    if len(text) <= size:
        return [text] if text else []

    parts = []
    current = ""

    for paragraph in text.splitlines():
        candidate = f"{current}\n{paragraph}".strip() if current else paragraph
        if len(candidate) <= size:
            current = candidate
        else:
            if current.strip():
                parts.append(current.strip())
            current = paragraph

    if current.strip():
        parts.append(current.strip())

    return parts or ([text] if text else [])