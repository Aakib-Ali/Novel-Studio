import { useEffect } from 'react';
import { useBooks } from '../context/BookContext';
import { useUI } from '../context/UIContext';
import { dashboardMetrics } from '../utils/book';
import MetricsStrip from '../components/book/MetricsStrip';
import BookCard from '../components/book/BookCard';
import CreateBookModal from '../components/book/CreateBookModal';

export default function Dashboard() {
  const { books, fetchBooks, loading } = useBooks();
  const { setCreateBookOpen } = useUI();

  useEffect(() => {
    fetchBooks();
  }, []);

  const metrics = dashboardMetrics(books);

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Library</p>
          <h1 className="page-title">Book production workspace</h1>
          <p className="page-subtitle">Manage uploads, translation, editorial correction, replacements, and multi-voice audio output from one operational console.</p>
        </div>
        <button className="btn btn-primary ns-btn ns-btn-primary" onClick={() => setCreateBookOpen(true)}>
          Create book
        </button>
      </section>

      <MetricsStrip items={metrics} />
      
      <section className="surface-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Active books</h2>
            <p className="section-note">{books.length} total records</p>
          </div>
          <button className="btn ns-btn ns-btn-secondary" onClick={() => setCreateBookOpen(true)}>
            New title
          </button>
        </div>

        <div className="book-grid">
          <button className="create-book-tile" onClick={() => setCreateBookOpen(true)}>
            <span className="create-book-plus">+</span>
            <span>Create a new book</span>
          </button>

          {books.map(book => <BookCard key={book.id} book={book} />)}
        </div>

        {!loading && books.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">NS</div>
            <h3>No books yet</h3>
            <p>Start by creating a title and uploading the first chapter file.</p>
          </div>
        )}
      </section>

      <CreateBookModal />
    </div>
  );
}