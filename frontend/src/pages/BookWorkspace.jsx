import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useBooks } from "../context/BookContext";
import { useWorkspace } from "../context/WorkspaceContext";
import api from "../api/api";
import useJobPolling from "../hooks/useJobPolling";
import BookHeaderBar from "../components/book/BookHeaderBar";
import WorkflowRail from "../components/book/WorkflowRail";
import UploadChapterPanel from "../components/book/UploadChapterPanel";
import ChapterTableV2 from "../components/chapter/ChapterTableV2";
import ChapterSplitWorkbench from "../components/chapter/ChapterSplitWorkbench";
import SidePanel from "../components/layout/SidePanel";
import ActivityCenter from "../components/activity/ActivityCenter";
import JobTicker from "../components/activity/JobTicker";

export default function BookWorkspace() {
  const { bookId } = useParams();
  const { currentBook, fetchBookById } = useBooks();
  const { selectedChapter, setSelectedChapter, sidePanelOpen, setSidePanelOpen } = useWorkspace();

  const [speakers, setSpeakers] = useState([]);
  const jobs = useJobPolling(bookId, fetchBookById);

  useEffect(() => {
    fetchBookById(bookId);
    api.listSpeakers().then((data) => setSpeakers(Array.isArray(data) ? data : []));
  }, [bookId, fetchBookById]);

  useEffect(() => {
    if (!selectedChapter && currentBook?.chapters?.length) {
      setSelectedChapter(currentBook.chapters[0]);
    }
  }, [currentBook, selectedChapter, setSelectedChapter]);

  const resolvedChapter = useMemo(() => {
    if (!selectedChapter || !currentBook?.chapters) return null;
    return (
      currentBook.chapters.find((chapter) => chapter.id === selectedChapter.id) || null
    );
  }, [selectedChapter, currentBook]);

  if (!currentBook) {
    return <div className="ns-surface">Loading workspace...</div>;
  }

  return (
    <div className="ns-page ns-page-workspace">
      <BookHeaderBar book={currentBook} />
      <WorkflowRail book={currentBook} speakers={speakers} />
      <JobTicker jobs={jobs} />

      <div className={`workspace-layout ${sidePanelOpen ? "with-side" : ""}`}>
        <section className="workspace-primary">
          <ChapterTableV2
            chapters={currentBook.chapters || []}
            selectedChapter={resolvedChapter}
            onSelectChapter={setSelectedChapter}
          />

          <ChapterSplitWorkbench
            book={currentBook}
            chapter={resolvedChapter}
            speakers={speakers}
          />
        </section>

        <SidePanel
          open={sidePanelOpen}
          title="Support panels"
          onToggle={() => setSidePanelOpen(!sidePanelOpen)}
        >
          <UploadChapterPanel bookId={bookId} />
          <ActivityCenter />
        </SidePanel>
      </div>
    </div>
  );
}