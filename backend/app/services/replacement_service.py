import re

def _preserve_case(source: str, replacement: str) -> str:
    if source.isupper():
        return replacement.upper()
    if source[:1].isupper():
        return replacement.capitalize()
    return replacement

def apply_replacements(text: str, replacements: list[dict]) -> str:
    updated = text or ""
    for rule in replacements:
        find = rule.get("find", "").strip()
        replace_with = rule.get("replace_with", "").strip()
        if not find:
            continue
        pattern = re.compile(re.escape(find), re.IGNORECASE)
        updated = pattern.sub(lambda m: _preserve_case(m.group(0), replace_with), updated)
    return updated