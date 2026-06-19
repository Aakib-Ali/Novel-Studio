import { api } from '../api/api';
import { useBooks } from '../context/BookContext';
import { useNotifications } from '../context/NotificationContext';
import { useUI } from '../context/UIContext';
import { useUploadProgress } from './useUploadProgress';

export function useBookActions() {
  const { fetchBooks, fetchBookById } = useBooks();
  const { setCreateBookOpen } = useUI();
  const { upsertNotification } = useNotifications();
  const upload = useUploadProgress();

  const createBook = async ({ title, author, file }) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('first_file', file);
    const book = await api.createBook(formData, upload.config);
    setCreateBookOpen(false);
    upload.reset();
    await fetchBooks();
    upsertNotification({
      id: `local-${book.id}`,
      title: 'Book created',
      message: `${book.title} was added to the workspace.`,
      status: 'completed',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
    return book;
  };

  const uploadChapter = async (bookId, { chapterNumber, title, file }) => {
    const formData = new FormData();
    if (chapterNumber) formData.append('chapter_number', chapterNumber);
    if (title) formData.append('title', title);
    formData.append('chapter_file', file);
    await api.uploadChapter(bookId, formData, upload.config);
    upload.reset();
    return fetchBookById(bookId);
  };

  const translateBook = async (bookId, targetLanguage = 'hi') => {
    await api.translateBook(bookId, { target_language: targetLanguage });
    return fetchBookById(bookId);
  };

  const replaceBook = async (bookId, replacements, sourceTextType = 'translated') => {
    await api.replaceBook(bookId, { replacements, source_text_type: sourceTextType });
    return fetchBookById(bookId);
  };

  const generateBookAudio = async (bookId, payload) => {
    await api.generateBookAudio(bookId, payload);
    return fetchBookById(bookId);
  };

  return {
    createBook,
    uploadChapter,
    translateBook,
    replaceBook,
    generateBookAudio,
    uploadProgress: upload.progress
  };
}