import { useState } from "react";
import { useUI } from "../../context/UIContext";
import useBookActions from "../../hooks/useBookActions";

export default function CreateBookModal() {
  const { createBookOpen, setCreateBookOpen } = useUI();
  const { createBook, uploadProgress } = useBookActions();

  const [form, setForm] = useState({
    title: "",
    author: "",
    file: null
  });
  const [saving, setSaving] = useState(false);

  if (!createBookOpen) return null;

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createBook(form);
      setForm({ title: "", author: "", file: null });
      setCreateBookOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-scrim">
      <div className="modal-card-v2">
        <div className="modal-head">
          <div>
            <h3>Create book</h3>
            <p>Every book starts with title, author, and the first TXT or PDF chapter file.</p>
          </div>

          <button className="ns-icon-btn" type="button" onClick={() => setCreateBookOpen(false)}>
            Close
          </button>
        </div>

        <form onSubmit={submit} className="form-stack">
          <div>
            <label>Title</label>
            <input
              className="ns-input"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label>Author</label>
            <input
              className="ns-input"
              value={form.author}
              onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
              required
            />
          </div>

          <div>
            <label>First chapter file</label>
            <input
              className="ns-input"
              type="file"
              accept=".txt,.pdf"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }))
              }
              required
            />
          </div>

          {uploadProgress > 0 ? (
            <div className="ns-progress">
              <div style={{ width: `${uploadProgress}%` }} />
            </div>
          ) : null}

          <div className="action-row">
            <button
              type="button"
              className="ns-btn ns-btn-secondary"
              onClick={() => setCreateBookOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="ns-btn ns-btn-primary" disabled={saving}>
              {saving ? "Creating..." : "Create book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}