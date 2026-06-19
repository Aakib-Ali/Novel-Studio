import { formatDateTime, formatStatus } from '../../utils/format';

export default function ChapterTable({ chapters, onOpenEditor }) {
  return (
    <section className="surface-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">Chapters</h2>
          <p className="section-note">Open any chapter for text correction, replacement, and audio work.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="ns-table">
          <thead>
            <tr>
              <th>Chapter</th>
              <th>Translation</th>
              <th>Replacement</th>
              <th>Audio</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {chapters.map(chapter => (
              <tr key={chapter.id}>
                <td>
                  <strong>Chapter {chapter.chapter_number}</strong>
                  <div className="muted-line">{chapter.title || 'Untitled chapter'}</div>
                </td>
                <td><span className={`status-pill ${chapter.translation_status}`}>{formatStatus(chapter.translation_status)}</span></td>
                <td><span className={`status-pill ${chapter.replacement_status}`}>{formatStatus(chapter.replacement_status)}</span></td>
                <td><span className={`status-pill ${chapter.audio_status}`}>{formatStatus(chapter.audio_status)}</span></td>
                <td>{formatDateTime(chapter.updated_at)}</td>
                <td>
                  <button className="btn ns-btn ns-btn-secondary" onClick={() => onOpenEditor(chapter)}>
                    Open editor
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}