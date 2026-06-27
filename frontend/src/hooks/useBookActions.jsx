import api from "../api/api";
import { useBooks } from "../context/BookContext";
import useUploadProgress from "./useUploadProgress";

export default function useBookActions() {
  const { fetchBooks, fetchBookById } = useBooks();
  const upload = useUploadProgress();

  const createBook = async ({ title, author, file }) => {
    const data = new FormData();
    data.append("title", title);
    data.append("author", author);
    data.append("firstfile", file);

    await api.createBook(data, upload.config);
    upload.reset();
    return fetchBooks();
  };

  const uploadChapter = async (bookId, { chapterNumber, title, file }) => {
    const data = new FormData();
    if (chapterNumber) data.append("chapternumber", chapterNumber);
    if (title) data.append("title", title);
    data.append("chapterfile", file);

    await api.uploadChapter(bookId, data, upload.config);
    upload.reset();
    return fetchBookById(bookId);
  };

  const translateBook = async (bookId, targetLanguage = "hi") => {
    await api.translateBook(bookId, { targetlanguage: targetLanguage });
    return fetchBookById(bookId);
  };

  const replaceBook = async (bookId, replacements, sourceTextType = "translated") => {
    await api.replaceBook(bookId, {
      replacements,
      sourcetexttype: sourceTextType
    });
    return fetchBookById(bookId);
  };

  const generateBookAudio = async (bookId, payload) => {
    await api.generateBookAudio(bookId, {
      language: payload.language,
      speakerid: payload.speakerId,
      sourcetexttype: payload.sourceTextType,
      accent: payload.accent
    });
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