import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { AppContainer } from "../components";
import {
  approveChapterTranslation,
  updateChapterTranslation,
  useBooks,
} from "../features/books/bookStore";
import { useSettings } from "../features/settings/settingsStore";
import styles from "./ChapterWorkspacePage.module.css";

type Mode = "read" | "edit" | "original";

export function ChapterWorkspacePage() {
  const { bookId, chapterId } = useParams();
  const book = useBooks().find((item) => item.id === bookId);
  const chapters = book?.chapterItems ?? [];
  const index = chapters.findIndex((item) => item.id === chapterId);
  const chapter = chapters[index];
  const { readingSize } = useSettings();

  const [mode, setMode] = useState<Mode>("read");
  const [error, setError] = useState("");

  if (!book || !chapter) {
    return (
      <AppContainer>
        <div className={styles.notFound}>
          <h1>Chapter not found</h1>
          <Link to={book ? `/books/${book.id}` : "/books"}>
            Back to Books
          </Link>
        </div>
      </AppContainer>
    );
  }

  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  const readingClass = `${styles.content} ${
    readingSize === "large" ? styles.largeText : ""
  }`;

  function changeText(value: string) {
    try {
      updateChapterTranslation(book!.id, chapter!.id, value);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save your changes.",
      );
    }
  }

  function approve() {
    try {
      approveChapterTranslation(book!.id, chapter!.id);
      setError("");
      setMode("read");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not approve this chapter.",
      );
    }
  }

  return (
    <AppContainer>
      <div className={styles.toolbar}>
        <Link
          className={styles.back}
          to={`/books/${book.id}/translation`}
        >
          <ArrowBackRoundedIcon fontSize="small" />
          Translation · {book.title}
        </Link>

        <span className={styles.position}>
          Chapter {index + 1} of {chapters.length}
        </span>
      </div>

      <div className={styles.workspaceHeader}>
        <div>
          <p className={styles.kicker}>
            Chapter {index + 1}
          </p>
          <h1>{chapter.title}</h1>
          <span className={styles.status}>
            {chapter.translationStatus === "approved"
              ? "Approved"
              : chapter.translationStatus === "draft"
                ? "Draft · saved on this device"
                : "Not started"}
          </span>
        </div>

        <div
          className={styles.modeTabs}
          role="group"
          aria-label="Workspace mode"
        >
          {(["read", "edit", "original"] as const).map(
            (item) => (
              <button
                key={item}
                type="button"
                className={`${styles.modeTab} ${
                  mode === item ? styles.active : ""
                }`}
                aria-pressed={mode === item}
                onClick={() => {
                  setMode(item);
                  setError("");
                }}
              >
                {item === "read"
                  ? "Read"
                  : item === "edit"
                    ? "Edit"
                    : "Original"}
              </button>
            ),
          )}
        </div>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {mode === "edit" ? (
        <section
          className={styles.editorPanel}
          aria-label="Translation editor"
        >
          <div className={styles.editorTop}>
            <span>Translated text</span>
            <span>Changes save as you type</span>
          </div>

          <textarea
            className={styles.editor}
            aria-label="Translated text"
            value={chapter.translatedText ?? ""}
            onChange={(event) =>
              changeText(event.target.value)
            }
            placeholder="Write or paste your translation here…"
            spellCheck
          />

          <div className={styles.editorBottom}>
            <p>
              Paragraph AI suggestions will be available when the
              translation service is connected.
            </p>
            <Button
              variant="contained"
              disabled={
                !chapter.translatedText?.trim() ||
                chapter.translationStatus === "approved"
              }
              onClick={approve}
            >
              Approve translation
            </Button>
          </div>
        </section>
      ) : mode === "original" ? (
        <article className={styles.reader}>
          <p className={styles.kicker}>
            Original text · read only
          </p>
          <div className={readingClass}>
            {chapter.originalText}
          </div>
        </article>
      ) : chapter.translatedText?.trim() ? (
        <article className={styles.reader}>
          <p className={styles.kicker}>Translated text</p>
          <div className={readingClass}>
            {chapter.translatedText}
          </div>
        </article>
      ) : (
        <div className={styles.empty}>
          <h2>No translation yet</h2>
          <p>
            Start writing a translation in Edit mode. The original
            chapter remains available in Original mode.
          </p>
          <Button
            variant="contained"
            onClick={() => setMode("edit")}
          >
            Start editing
          </Button>
        </div>
      )}

      <nav
        className={styles.chapterNav}
        aria-label="Chapter navigation"
      >
        {previous ? (
          <Button
            component={Link}
            to={`/books/${book.id}/chapters/${previous.id}`}
            startIcon={<ChevronLeftRoundedIcon />}
          >
            Previous chapter
          </Button>
        ) : (
          <span />
        )}

        {next && (
          <Button
            component={Link}
            to={`/books/${book.id}/chapters/${next.id}`}
            endIcon={<ChevronRightRoundedIcon />}
          >
            Next chapter
          </Button>
        )}
      </nav>
    </AppContainer>
  );
}