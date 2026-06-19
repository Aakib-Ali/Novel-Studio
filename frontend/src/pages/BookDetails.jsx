import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { useUI } from '../context/UIContext';
import { api } from '../api/api';
import { useJobPolling } from '../hooks/useJobPolling';
import MetricsStrip from '../components/book/MetricsStrip';
import UploadChapterPanel from '../components/book/UploadChapterPanel';
import BookActions from '../components/book/BookActions';
import ChapterTable from '../components/chapter/ChapterTable';
import ChapterEditorOffcanvas from '../components/chapter/ChapterEditorOffcanvas';
import { bookDetailMetrics } from '../utils/book';

export default function BookDetails() {
  const { bookId } = useParams();
  const { currentBook, fetchBookById } = useBooks();
  const { setEditorChapter } = useUI();
  const [speakers, setSpeakers] = useState([]);
  const jobs = useJobPolling(bookId);

  useEffect(() => {
    fetchBookById(bookId);
    api.listSpeakers().then(setSpeakers);
  }, [bookId]);

  const metrics = useMemo(() => bookDetailMetrics(currentBook), [currentBook]);

  if (!currentBook) {
    return <div className="surface-card">Loading book...</div>;
  }

  return (
    <div className="page-stack">
      <section className="page-hero page-hero-detail">
        <div>
          <p className="eyebrow">Book</p>
          <h1 className="page-title">{currentBook.title}</h1>
          <p className="page-subtitle">Author: {currentBook.author} · Workflow: {currentBook.workflow_status.replaceAll('_', ' ')}</p>
        </div>
      </section>

      <MetricsStrip items={metrics} compact />

      <div className="two-col-layout">
        <div className="main-col">
          <BookActions book={currentBook} speakers={speakers} jobs={jobs} />
          <ChapterTable chapters={currentBook.chapters || []} onOpenEditor={setEditorChapter} />
        </div>
        <div className="side-col">
          <UploadChapterPanel bookId={bookId} />
        </div>
      </div>

      <ChapterEditorOffcanvas book={currentBook} speakers={speakers} />
    </div>
  );
}