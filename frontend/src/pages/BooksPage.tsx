import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import {
  AppContainer,
  BookCard,
  BookCover,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "../components";
import {
  createBook,
  formatWords,
  useBooks,
  type BookStatus,
} from "../features/books/bookStore";
import styles from "./BooksPage.module.css";

type ViewMode = "grid" | "list";
type SortMode = "recent" | "title" | "chapters" | "progress";

const filters: { label: string; value: BookStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Processing", value: "processing" },
  { label: "Translating", value: "translating" },
  { label: "Review", value: "review" },
  { label: "Approved", value: "approved" },
  { label: "Audio Ready", value: "audio-ready" },
  { label: "Failed", value: "failed" },
];

export function BooksPage() {
  const books = useBooks();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BookStatus | "all">("all");
  const [sort, setSort] = useState<SortMode>("recent");
  const [view, setView] = useState<ViewMode>("grid");
  const [createOpen, setCreateOpen] = useState(
    searchParams.get("create") === "1"
  );
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const visibleBooks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    const result = books.filter(
      (book) =>
        (filter === "all" || book.status === filter) &&
        (!query ||
          book.title.toLocaleLowerCase().includes(query) ||
          book.author.toLocaleLowerCase().includes(query))
    );

    return [...result].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "chapters") return b.chapters - a.chapters;
      if (sort === "progress") return b.progress - a.progress;
      return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    });
  }, [books, filter, search, sort]);

  function closeCreate() {
    setCreateOpen(false);
    setTitle("");
    setAuthor("");
  }

  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !author.trim()) return;

    const book = createBook(title, author);
    closeCreate();
    navigate(`/books/${book.id}`);
  }

  return (
    <AppContainer>
      <PageHeader
        eyebrow="Library"
        title="Books"
        description="Your novels, manuscripts and audiobook projects."
        actions={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create Book
          </Button>
        }
      />

      <section
        className={styles.tools}
        aria-label="Book search and filters"
      >
        <div className={styles.toolbar}>
          <TextField
            label="Search books"
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={styles.search}
            InputProps={{
              startAdornment: (
                <SearchRoundedIcon
                  className={styles.searchIcon}
                  fontSize="small"
                />
              ),
            }}
          />

          <div className={styles.sortRow}>
            <TextField
              select
              size="small"
              label="Sort by"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortMode)
              }
              className={styles.sort}
            >
              <MenuItem value="recent">Recently updated</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="chapters">Chapters</MenuItem>
              <MenuItem value="progress">
                Translation progress
              </MenuItem>
            </TextField>

            <ToggleButtonGroup
              exclusive
              size="small"
              value={view}
              onChange={(_, value: ViewMode | null) =>
                value && setView(value)
              }
              aria-label="Library view"
              className={styles.viewSwitch}
            >
              <ToggleButton value="grid" aria-label="Grid view">
                <GridViewRoundedIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list" aria-label="List view">
                <ListRoundedIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>

        <div
          className={styles.filters}
          aria-label="Filter by book status"
        >
          {filters.map((item) => (
            <button
              type="button"
              key={item.value}
              className={`${styles.filter} ${
                filter === item.value ? styles.selectedFilter : ""
              }`}
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <div className={styles.resultHeader}>
        <h2>
          {visibleBooks.length}{" "}
          {visibleBooks.length === 1 ? "book" : "books"}
        </h2>
        <p>Choose a book to continue working.</p>
      </div>

      {visibleBooks.length === 0 ? (
        <EmptyState
          icon={<SearchRoundedIcon />}
          title={books.length === 0 ? "No books yet" : "No books found"}
          description={
            books.length === 0
              ? "Create your first book to begin."
              : "Try another search or change the status filter."
          }
          action={
            books.length === 0 ? (
              <Button
                variant="contained"
                onClick={() => setCreateOpen(true)}
              >
                Create Book
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            )
          }
        />
      ) : view === "grid" ? (
        <div className={styles.grid}>
          {visibleBooks.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author}
              chapters={book.chapters}
              words={formatWords(book.words)}
              progress={book.progress}
              status={book.status}
              onOpen={() => navigate(`/books/${book.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {visibleBooks.map((book) => (
            <Link
              key={book.id}
              className={styles.listRow}
              to={`/books/${book.id}`}
            >
              <BookCover
                title={book.title}
                author={book.author}
                width={52}
                height={78}
              />

              <span className={styles.listText}>
                <strong>{book.title}</strong>
                <small>
                  {book.author} · {book.chapters} chapters ·{" "}
                  {formatWords(book.words)} words
                </small>
              </span>

              <span className={styles.listStatus}>
                <StatusBadge status={book.status} />
              </span>
            </Link>
          ))}
        </div>
      )}

      <Dialog
        open={createOpen}
        onClose={closeCreate}
        fullWidth
        maxWidth="sm"
        aria-labelledby="create-book-title"
      >
        <form onSubmit={submitCreate}>
          <DialogTitle id="create-book-title">
            Create a book
          </DialogTitle>

          <DialogContent className={styles.form}>
            <p>
              Start with the book details. You can add chapters later.
            </p>

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
            <Button onClick={closeCreate}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!title.trim() || !author.trim()}
            >
              Create Book
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </AppContainer>
  );
}