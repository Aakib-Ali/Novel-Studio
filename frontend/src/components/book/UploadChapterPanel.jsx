import { useState } from 'react';
import { useBookActions } from '../../hooks/useBookActions';

export default function UploadChapterPanel({ bookId }) {
  const { uploadChapter, uploadProgress } = useBookActions();
  const [form, setForm] = useState({ chapterNumber: '', title: '', file: null });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await uploadChapter(bookId, form);
      setForm({ chapterNumber: '', title: '', file: null });
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="surface-card sticky-panel">
      <div className="section-header">
        <div>
          <h3 className="section-title">Upload chapter</h3>
          <p className="section-note">Append new TXT or PDF content to this title.</p>
        </div>
      </div>

      <form onSubmit={submit} className="form-stack">
        <div>
          <label>Chapter number</label>
          <input className="form-control ns-input" type="number" value={form.chapterNumber} onChange={e => setForm({ ...form, chapterNumber: e.target.value })} placeholder="Auto assign if empty" />
        </div>
        <div>
          <label>Chapter title</label>
          <input className="form-control ns-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Optional" />
        </div>
        <div>
          <label>Chapter file</label>
          <input className="form-control ns-input" type="file" accept=".txt,.pdf" onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })} required />
        </div>

        {uploadProgress > 0 && (
          <div className="progress-shell">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        <button className="btn ns-btn ns-btn-primary" disabled={saving}>
          {saving ? 'Uploading...' : 'Upload chapter'}
        </button>
      </form>
    </aside>
  );
}