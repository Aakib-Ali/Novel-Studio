import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { AppContainer } from "../components";
import { useBooks } from "../features/books/bookStore";
import styles from "./TranslationPage.module.css";

export function TranslationPage() {
  const { bookId } = useParams();
  const book = useBooks().find((item) => item.id === bookId);

  if (!book) {
    return (
      <AppContainer>
        <div className={styles.empty}>
          <h1>Book not found</h1>
          <Link to="/books">Back to Books</Link>
        </div>
      </AppContainer>
    );
  }

  const chapters = book.chapterItems ?? [];
  const approved = chapters.filter(
    (item) => item.translationStatus === "approved"
  ).length;
  const drafts = chapters.filter(
    (item) => item.translationStatus === "draft"
  ).length;

  return (
    <AppContainer>
      <Link
        className={styles.back}
        to={`/books/${book.id}`}
      >
        <ArrowBackRoundedIcon fontSize="small" />
        {book.title}
      </Link>

      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Book workspace</p>
          <h1>Translation</h1>
          <p>
            Work through chapters, review your text, and approve
            each chapter when it is ready.
          </p>
        </div>

        <div className={styles.counts}>
          <strong>
            {approved} / {chapters.length}
          </strong>
          <span>chapters approved</span>
        </div>
      </div>

      {chapters.length === 0 ? (
        <div className={styles.empty}>
          <TranslateOutlinedIcon
            color="primary"
            fontSize="large"
          />
          <h2>No chapter text yet</h2>
          <p>
            Upload chapters before working on translation.
            Sample chapter totals do not contain readable text.
          </p>
          <Button
            component={Link}
            to={`/books/${book.id}/chapters/upload`}
            variant="contained"
          >
            Upload chapters
          </Button>
        </div>
      ) : (
        <section
          className={styles.panel}
          aria-label="Translation chapters"
        >
          <div className={styles.panelHeader}>
            <h2>Chapters</h2>
            <span>
              {drafts} in draft · {approved} approved
            </span>
          </div>

          <div className={styles.list}>
            {chapters.map((chapter, index) => (
              <Link
                className={styles.row}
                key={chapter.id}
                to={`/books/${book.id}/chapters/${chapter.id}`}
              >
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className={styles.title}>
                  {chapter.title}
                  <small>
                    {chapter.words.toLocaleString()} original words
                  </small>
                </span>

                <span
                  className={`${styles.badge} ${
                    chapter.translationStatus === "approved"
                      ? styles.approved
                      : chapter.translationStatus === "draft"
                        ? styles.draft
                        : styles.pending
                  }`}
                >
                  {chapter.translationStatus === "approved"
                    ? "Approved"
                    : chapter.translationStatus === "draft"
                      ? "Draft"
                      : "Not started"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </AppContainer>
  );
}