import { Link } from 'react-router-dom';
import { workflowPercent } from '../../utils/book';
import { formatDateTime } from '../../utils/format';

export default function BookCard({ book }) {
  const percent = workflowPercent(book);

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="book-card-top">
        <span className={`status-pill ${book.workflow_status}`}>{book.workflow_status.replaceAll('_', ' ')}</span>
        <small>{formatDateTime(book.updated_at)}</small>
      </div>
      <h3>{book.title}</h3>
      <p className="book-meta">{book.author}</p>
      <p className="book-summary">{book.summary || 'Text extracted and ready for workflow actions.'}</p>

      <div className="metric-inline-grid">
        <div><strong>{book.chapters_count}</strong><span>Chapters</span></div>
        <div><strong>{book.translated_count}</strong><span>Translated</span></div>
        <div><strong>{book.audio_count}</strong><span>Audios</span></div>
      </div>

      <div className="progress-shell">
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>
    </Link>
  );
}