import { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useBookActions } from '../../hooks/useBookActions';

export default function CreateBookModal() {
  const { createBookOpen, setCreateBookOpen } = useUI();
  const { createBook, uploadProgress } = useBookActions();
  const [form, setForm] = useState({ title: '', author: '', file: null });
  const [submitting, setSubmitting] = useState(false);

  if (!createBookOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createBook(form);
      setForm({ title: '', author: '', file: null });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-ns">
      <div className="modal-card-ns">
        <div className="section-header">
          <div>
            <h3 className="section-title">Create book</h3>
            <p className="section-note">Upload the first TXT or PDF chapter during creation.</p>
          </div>
          <button className="icon-button" onClick={() => setCreateBookOpen(false)}>Close</button>
        </div>

        <form onSubmit={submit} className="form-stack">
          <div>
            <label>Title</label>
            <input className="form-control ns-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label>Author</label>
            <input className="form-control ns-input" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
          </div>
          <div>
            <label>First chapter file</label>
            <input className="form-control ns-input" type="file" accept=".txt,.pdf" onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })} required />
          </div>

          {uploadProgress > 0 && (
            <div className="progress-shell">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          <div className="action-row">
            <button type="button" className="btn ns-btn ns-btn-secondary" onClick={() => setCreateBookOpen(false)}>Cancel</button>
            <button type="submit" className="btn ns-btn ns-btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}