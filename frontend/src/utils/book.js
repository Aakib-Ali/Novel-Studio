export function assetLabel(asset) {
  return asset.voice_name || asset.language;
}

export function workflowPercent(book) {
  const total = Math.max(book.chapters_count || 0, 1);
  const translated = book.translated_count || 0;
  const replaced = book.replaced_count || 0;
  const audio = Math.min(book.audio_count || 0, total);

  return Math.min(100, Math.round(((translated + replaced + audio) / (total * 3)) * 100));
}

export function dashboardMetrics(books) {
  return [
    {
      label: "Books",
      value: books.length,
      note: "Titles in the workspace"
    },
    {
      label: "Chapters",
      value: books.reduce((a, b) => a + (b.chapters_count || 0), 0),
      note: "Uploaded source units"
    },
    {
      label: "Translated",
      value: books.reduce((a, b) => a + (b.translated_count || 0), 0),
      note: "Editable translated drafts"
    },
    {
      label: "Audio assets",
      value: books.reduce((a, b) => a + (b.audio_count || 0), 0),
      note: "Generated voice outputs"
    }
  ];
}