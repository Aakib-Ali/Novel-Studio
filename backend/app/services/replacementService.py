import re


def preservecase(source: str, replacement: str) -> str:
    if source.isupper():
        return replacement.upper()
    if source[:1].isupper():
        return replacement.capitalize()
    return replacement


def applyreplacements(text: str, replacements: list[dict]) -> str:
    updated = text or ""

    for rule in replacements:
        find = rule.get("find", "").strip()
        replacewith = rule.get("replacewith", "").strip()
        if not find:
            continue

        pattern = re.compile(re.escape(find), re.IGNORECASE)
        updated = pattern.sub(lambda match: preservecase(match.group(0), replacewith), updated)

    return updated