import { formatDateTime } from "../../utils/format";

export default function BookHeaderBar({ book }) {
  if (!book) return null;

  return (
    <section className="book-header-bar">
      <div>
        <p className="ns-eyebrow">Book workspace</p>
        <h1>{book.title}</h1>
        <p>
          {book.author} · Last updated {formatDateTime(book.updatedat || book.updated_at)}
        </p>
      </div>

      <div className="book-header-metrics">
        <div>
          <strong>{book.chapterscount ?? book.chapters_count ?? 0}</strong>
          <span>Chapters</span>
        </div>
        <div>
          <strong>{book.translatedcount ?? book.translated_count ?? 0}</strong>
          <span>Translated</span>
        </div>
        <div>
          <strong>{book.replacedcount ?? book.replaced_count ?? 0}</strong>
          <span>Replaced</span>
        </div>
        <div>
          <strong>{book.audiocount ?? book.audio_count ?? 0}</strong>
          <span>Audio assets</span>
        </div>
      </div>
    </section>
  );
}