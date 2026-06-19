export function workflowPercent(book) {
  const total = Math.max(book.chapters_count || 0, 1);
  const translated = book.translated_count || 0;
  const replaced = book.replaced_count || 0;
  const audio = book.audio_count ? Math.min(book.audio_count, total) : 0;
  return Math.min(100, Math.round(((translated + replaced + audio) / (total * 3)) * 100));
}

export function dashboardMetrics(books = []) {
  const totalBooks = books.length;
  const totalChapters = books.reduce((sum, b) => sum + (b.chapters_count || 0), 0);
  const translated = books.reduce((sum, b) => sum + (b.translated_count || 0), 0);
  const audios = books.reduce((sum, b) => sum + (b.audio_count || 0), 0);

  return [
    { label: 'Books', value: totalBooks, note: 'Titles in library' },
    { label: 'Chapters', value: totalChapters, note: 'Uploaded source units' },
    { label: 'Translated', value: translated, note: 'Ready for editorial correction' },
    { label: 'Audio assets', value: audios, note: 'Generated voice outputs' }
  ];
}

export function bookDetailMetrics(book) {
  if (!book) return [];
  return [
    { label: 'Chapters', value: book.chapters_count, note: 'Source files parsed' },
    { label: 'Translated', value: book.translated_count, note: 'Editable translated drafts' },
    { label: 'Replaced', value: book.replaced_count, note: 'Replacement outputs ready' },
    { label: 'Audio', value: book.audio_count, note: 'Stored voice versions' }
  ];
}