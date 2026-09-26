import { useState, type FormEvent } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  AppContainer,
  BookCover,
  ProgressBar,
  StatusBadge,
} from "../components";
import {
  deleteBook,
  formatWords,
  updateBook,
  useBooks,
} from "../features/books/bookStore";
import styles from "./BookDetailsPage.module.css";

export function BookDetailsPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const books = useBooks();
  const book = books.find((item) => item.id === bookId);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  function openEdit() {
    if (!book) return;

    setTitle(book.title);
    setAuthor(book.author);
    setEditOpen(true);
  }

  function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!book) return;

    updateBook(book.id, title, author);
    setEditOpen(false);
  }

  function confirmDelete() {
    if (!book) return;

    if (deleteBook(book.id)) {
      navigate("/books", { replace: true });
    }
  }

  if (!book) {
    return (
      <AppContainer>
        <div className={styles.notFound}>
          <h1>Book not found</h1>
          <p>This book may have been removed or the link may be incorrect.</p>
          <Link to="/books">Back to Books</Link>
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Link className={styles.back} to="/books">
        <ArrowBackRoundedIcon fontSize="small" />
        Books
      </Link>

      <section className={styles.identity} aria-labelledby="book-title">
        <BookCover
          title={book.title}
          author={book.author}
          width="100%"
          height="100%"
        />

        <div className={styles.identityText}>
          <StatusBadge status={book.status} />

          <h1 id="book-title">{book.title}</h1>
          <p className={styles.author}>by {book.author}</p>

          <p className={styles.summary}>
            {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"} ·{" "}
            {formatWords(book.words)} words
          </p>

          <div className={styles.actions}>
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={openEdit}
            >
              Edit details
            </Button>

            <Button
              color="error"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={() => setDeleteOpen(true)}
            >
              Delete book
            </Button>
          </div>
        </div>
      </section>

      <div className={styles.sections}>
        <section className={styles.panel}>
          <div className={styles.sectionTop}>
            <div className={styles.sectionHeading}>
              <AutoStoriesOutlinedIcon color="primary" />
              <h2>Chapters</h2>
            </div>

            <Button
              component={Link}
              to={`/books/${book.id}/chapters/upload`}
              size="small"
              variant="outlined"
            >
              Upload chapters
            </Button>
          </div>

          {(book.chapterItems ?? []).length > 0 ? (
            <div className={styles.chapterList}>
              {(book.chapterItems ?? []).map((chapter, index) => (
                <Link
                  className={styles.chapterRow}
                  key={chapter.id}
                  to={`/books/${book.id}/chapters/${chapter.id}`}
                >
                  <span className={styles.chapterNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.chapterTitle}>{chapter.title}</span>
                  <span className={styles.chapterWords}>
                    {formatWords(chapter.words)} words
                  </span>
                </Link>
              ))}
            </div>
          ) : book.chapters === 0 ? (
            <p className={styles.message}>
              This book has no chapters yet. Upload text files to start working
              on the story.
            </p>
          ) : (
            <p className={styles.message}>
              {book.chapters} chapters · {formatWords(book.words)} words in this
              sample project. Chapter text has not been added yet.
            </p>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionTop}>
            <div className={styles.sectionHeading}>
              <TranslateOutlinedIcon color="primary" />
              <h2>Translation</h2>
            </div>

            <Button
              component={Link}
              to={`/books/${book.id}/translation`}
              size="small"
              variant="outlined"
            >
              Open workspace
            </Button>
          </div>

          {book.progress > 0 ? (
            <div className={styles.translation}>
              <div className={styles.progressLabels}>
                <span>Progress</span>
                <strong>{book.progress}%</strong>
              </div>

              <ProgressBar value={book.progress} />
            </div>
          ) : (
            <p className={styles.message}>Translation has not started.</p>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.sectionTop}>
            <div className={styles.sectionHeading}>
              <AudiotrackOutlinedIcon color="primary" />
              <h2>Audio Studio</h2>
            </div>

            <Button
              component={Link}
              to={`/books/${book.id}/audio`}
              size="small"
              variant="outlined"
            >
              Open workspace
            </Button>
          </div>

          <p className={styles.message}>
            Choose approved translations and prepare narration and music
            settings.
          </p>
        </section>
      </div>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="edit-book-title"
      >
        <form onSubmit={submitEdit}>
          <DialogTitle id="edit-book-title">Edit book details</DialogTitle>

          <DialogContent className={styles.editForm}>
            <TextField
              autoFocus
              required
              fullWidth
              label="Book title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              inputProps={{ maxLength: 160 }}
            />

            <TextField
              required
              fullWidth
              label="Author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              inputProps={{ maxLength: 120 }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!title.trim() || !author.trim()}
            >
              Save changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-book-title"
      >
        <DialogTitle id="delete-book-title">
          Delete {book.title}?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            This removes the book from your library. This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
          >
            Delete book
          </Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  );
}