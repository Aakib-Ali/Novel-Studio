import { useEffect } from "react";
import { useBooks } from "../context/BookContext";
import { useUI } from "../context/UIContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { dashboardMetrics } from "../utils/book";
import { filterBooks } from "../utils/filters";
import LibraryHero from "../components/book/LibraryHero";
import KPIGrid from "../components/book/KPIGrid";
import BookFilters from "../components/book/BookFilters";
import BookCardV2 from "../components/book/BookCardV2";
import ActivityCenter from "../components/activity/ActivityCenter";
import CreateBookModal from "../components/book/CreateBookModal";
import EmptyState from "../components/feedback/EmptyState";

export default function LibraryDashboard() {
  const { books, fetchBooks } = useBooks();
  const { setCreateBookOpen } = useUI();
  const { libraryQuery, statusFilter } = useWorkspace();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const metrics = dashboardMetrics(books);
  const filtered = filterBooks(books, libraryQuery, statusFilter);

  return (
    <div className="ns-page">
      <LibraryHero onCreate={() => setCreateBookOpen(true)} />

      <KPIGrid items={metrics} />

      <div className="ns-grid ns-grid-main">
        <section className="ns-surface">
          <BookFilters />

          <div className="ns-card-grid">
            <button
              className="ns-create-card"
              type="button"
              onClick={() => setCreateBookOpen(true)}
            >
              <span className="ns-create-mark">+</span>
              <strong>Create book</strong>
              <small>Start a new audiobook production workflow</small>
            </button>

            {filtered.map((book) => (
              <BookCardV2 key={book.id} book={book} />
            ))}
          </div>

          {!filtered.length ? (
            <EmptyState
              title="No matching books"
              description="Adjust your filters or create a new book record."
              actionLabel="Create book"
              onAction={() => setCreateBookOpen(true)}
            />
          ) : null}
        </section>

        <ActivityCenter compact />
      </div>

      <CreateBookModal />
    </div>
  );
}