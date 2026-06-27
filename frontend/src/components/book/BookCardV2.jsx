import { Link } from "react-router-dom";
import { workflowPercent } from "../../utils/book";
import { formatDateTime, formatStatus } from "../../utils/format";

export default function BookCardV2({ book }) {
  const percent = workflowPercent(book);

  return (
    <Link to={`/books/${book.id}`} className="book-card-v2">
      <div className="card-row">
        <span className={`ns-badge ${book.workflow_status}`}>
          {formatStatus(book.workflow_status)}
        </span>
        <small>{formatDateTime(book.updated_at)}</small>
      </div>

      <h3>{book.title}</h3>
      <p className="card-sub">{book.author}</p>
      <p className="card-copy">
        {book.summary || "Source content uploaded and ready for processing."}
      </p>

      <div className="stats-inline">
        <div>
          <strong>{book.chapters_count || 0}</strong>
          <span>Chapters</span>
        </div>
        <div>
          <strong>{book.translated_count || 0}</strong>
          <span>Translated</span>
        </div>
        <div>
          <strong>{book.audio_count || 0}</strong>
          <span>Audio</span>
        </div>
      </div>

      <div className="ns-progress">
        <div style={{ width: `${percent}%` }} />
      </div>
    </Link>
  );
}