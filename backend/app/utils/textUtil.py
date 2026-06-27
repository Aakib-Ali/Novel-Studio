import re

def excerpt(text: str | None, limit: int = 220) -> str:
    if not text:
        return ""
    normalized = re.sub(r"\s+", " ", text).strip()
    return normalized[:limit] + ("..." if len(normalized) > limit else "")

def chunk_text(text: str, size: int = 3000):
    text = text or ""
    parts = []
    current = ""
    for paragraph in text.split("\n"):
        if len(current) + len(paragraph) + 1 > size:
            if current.strip():
                parts.append(current)
            current = paragraph
        else:
            current += ("\n" if current else "") + paragraph
    if current.strip():
        parts.append(current)
    return parts or [text]