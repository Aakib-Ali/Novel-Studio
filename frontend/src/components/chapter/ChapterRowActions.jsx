export default function ChapterRowActions({ chapter }) {
  if (!chapter) return null;

  return (
    <div className="chapter-row-actions" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="ns-button ns-button-ghost">
        Open
      </button>
    </div>
  );
}