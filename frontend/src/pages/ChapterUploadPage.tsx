import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { AppContainer } from "../components";
import { addChapter, useBooks } from "../features/books/bookStore";
import styles from "./ChapterUploadPage.module.css";

type UploadStatus =
  | "ready"
  | "processing"
  | "complete"
  | "invalid"
  | "failed";

interface UploadItem {
  id: string;
  file: File;
  status: UploadStatus;
  message?: string;
}

const maxFiles = 8;
const maxFileBytes = 128 * 1024;

function validate(file: File) {
  if (!/\.(txt|md)$/i.test(file.name)) {
    return "Use a .txt or .md file. ZIP processing needs the server upload flow.";
  }
  if (file.size === 0) return "This file is empty.";
  if (file.size > maxFileBytes) {
    return "This demo accepts files up to 128 KB each.";
  }
  return null;
}

export function ChapterUploadPage() {
  const { bookId } = useParams();
  const book = useBooks().find((item) => item.id === bookId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [busy, setBusy] = useState(false);

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files);

    setItems((previous) => {
      const slots = Math.max(0, maxFiles - previous.length);

      return [
        ...previous,
        ...incoming.slice(0, slots).map((file) => {
          const message = validate(file);

          return {
            id: crypto.randomUUID(),
            file,
            status: message ? ("invalid" as const) : ("ready" as const),
            message: message ?? undefined,
          };
        }),
      ];
    });
  }

  function onChoose(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!busy) addFiles(event.dataTransfer.files);
  }

  async function processItems(retryFailed = false) {
    if (!bookId || busy) return;

    const pending = items.filter(
      (item) =>
        item.status === "ready" ||
        (retryFailed && item.status === "failed")
    );
    if (!pending.length) return;

    setBusy(true);

    for (const item of pending) {
      setItems((previous) =>
        previous.map((entry) =>
          entry.id === item.id
            ? { ...entry, status: "processing", message: undefined }
            : entry
        )
      );

      try {
        const text = await item.file.text();
        addChapter(bookId, item.file.name, text);

        setItems((previous) =>
          previous.map((entry) =>
            entry.id === item.id
              ? { ...entry, status: "complete" }
              : entry
          )
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "The file could not be processed.";

        setItems((previous) =>
          previous.map((entry) =>
            entry.id === item.id
              ? { ...entry, status: "failed", message }
              : entry
          )
        );
      }
    }

    setBusy(false);
  }

  if (!book) {
    return (
      <AppContainer>
        <div className={styles.notFound}>
          <h1>Book not found</h1>
          <Link to="/books">Back to Books</Link>
        </div>
      </AppContainer>
    );
  }

  const complete = items.filter(
    (item) => item.status === "complete"
  ).length;
  const failed = items.filter(
    (item) => item.status === "failed"
  ).length;
  const ready = items.filter(
    (item) => item.status === "ready"
  ).length;

  return (
    <AppContainer>
      <Link className={styles.back} to={`/books/${book.id}`}>
        <ArrowBackRoundedIcon fontSize="small" />
        {book.title}
      </Link>

      <div className={styles.header}>
        <div>
          <h1>Upload chapters</h1>
          <p>
            Add chapter text files to {book.title}. No translation
            starts automatically.
          </p>
        </div>

        <Button
          component={Link}
          to={`/books/${book.id}`}
          variant="outlined"
        >
          View book
        </Button>
      </div>

      <div
        className={styles.dropZone}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <UploadFileRoundedIcon color="primary" fontSize="large" />
        <strong>Drop chapter files here</strong>
        <span>
          Choose up to {maxFiles} .txt or .md files, 128 KB each.
        </span>

        <Button
          variant="outlined"
          onClick={() => inputRef.current?.click()}
          disabled={busy || items.length >= maxFiles}
        >
          Choose files
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept=".txt,.md,text/plain,text/markdown"
          multiple
          hidden
          onChange={onChoose}
        />
      </div>

      {items.length > 0 && (
        <section className={styles.queue} aria-label="Upload queue">
          <div className={styles.queueHeader}>
            <div>
              <h2>Files</h2>
              <p>
                {complete} complete · {failed} failed · {ready} ready
              </p>
            </div>

            <div className={styles.actions}>
              {failed > 0 && (
                <Button
                  variant="outlined"
                  disabled={busy}
                  onClick={() => processItems(true)}
                >
                  Retry failed
                </Button>
              )}

              <Button
                variant="contained"
                disabled={busy || ready === 0}
                onClick={() => processItems()}
              >
                {busy ? "Processing…" : "Process files"}
              </Button>
            </div>
          </div>

          <div className={styles.rows}>
            {items.map((item) => (
              <div className={styles.row} key={item.id}>
                <div className={styles.fileName}>
                  <strong>{item.file.name}</strong>
                  <span>
                    {Math.ceil(item.file.size / 1024)} KB
                  </span>
                </div>

                <span
                  className={`${styles.status} ${styles[item.status]}`}
                >
                  {item.status === "complete" && (
                    <CheckCircleOutlineRoundedIcon fontSize="inherit" />
                  )}
                  {item.status}
                </span>

                {item.message && (
                  <p className={styles.message}>{item.message}</p>
                )}
              </div>
            ))}
          </div>

          {complete > 0 && (
            <p className={styles.result}>
              Successfully added chapters are available on the book
              page, even if other files failed.
            </p>
          )}
        </section>
      )}
    </AppContainer>
  );
}