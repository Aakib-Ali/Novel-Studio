from sqlalchemy.orm import Session

from app.models.bookModel import Book
from app.models.chapterModel import Chapter
from app.services.fileparserService import extracttextfromfile
from app.services.storageService import saveupload
from app.utils.idsUtil import generateid


def nextchapternumber(book: Book) -> int:
    if not book.chapters:
        return 1
    return max(ch.chapternumber for ch in book.chapters) + 1


def createchapter(
    db: Session,
    book: Book,
    chapterfile,
    chapternumber: int | None = None,
    title: str | None = None,
):
    path = saveupload(chapterfile)
    extracted = extracttextfromfile(path)
    number = chapternumber or nextchapternumber(book)

    chapter = Chapter(
        id=generateid("chp"),
        bookid=book.id,
        chapternumber=number,
        title=title or f"Chapter {number}",
        originaltext=extracted,
        translationstatus="notstarted",
        replacementstatus="notstarted",
        audiostatus="notstarted",
    )
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    return chapter


def savetranslatedtext(db: Session, chapter: Chapter, translatedtext: str):
    chapter.translatedtext = translatedtext
    chapter.translationstatus = "completed" if translatedtext else "notstarted"
    db.commit()
    db.refresh(chapter)
    return chapter


def savereplacedtext(db: Session, chapter: Chapter, replacedtext: str):
    chapter.replacedtext = replacedtext
    chapter.replacementstatus = "completed" if replacedtext else "notstarted"
    db.commit()
    db.refresh(chapter)
    return chapter