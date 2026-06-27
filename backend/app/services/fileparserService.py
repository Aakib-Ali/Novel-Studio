from pathlib import Path

from pypdf import PdfReader


def extracttextfromfile(path: Path) -> str:
    suffix = path.suffix.lower()

    if suffix == ".txt":
        return path.read_text(encoding="utf-8", errors="ignore").strip()

    if suffix == ".pdf":
        reader = PdfReader(str(path))
        text = "\n".join((page.extract_text() or "").strip() for page in reader.pages).strip()
        return text

    raise ValueError("Unsupported file type. Only .txt and .pdf are allowed.")