import { useState } from "react";
import useBookActions from "../../hooks/useBookActions";

export default function UploadChapterPanel({ bookId }) {
  const { uploadChapter, uploadProgress } = useBookActions();

  const [form, setForm] = useState({
    chapterNumber: "",
    title: "",
    file: null
  });
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await uploadChapter(bookId, form);
      setForm({ chapterNumber: "", title: "", file: null });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="ns-surface">
      <div className="section-top">
        <div>
          <h3>Upload chapter</h3>
          <p>Add more source text to the book.</p>
        </div>
      </div>

      <form onSubmit={submit} className="form-stack">
        <div>
          <label>Chapter number</label>
          <input
            className="ns-input"
            type="number"
            value={form.chapterNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, chapterNumber: e.target.value }))}
            placeholder="Auto assign if empty"
          />
        </div>

        <div>
          <label>Chapter title</label>
          <input
            className="ns-input"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <label>Chapter file</label>
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

        <button className="ns-btn ns-btn-primary" type="submit" disabled={saving}>
          {saving ? "Uploading..." : "Upload chapter"}
        </button>
      </form>
    </section>
  );
}