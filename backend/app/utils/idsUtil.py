from uuid import uuid4


def generateid(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex}"