import api from "../api/api";
import { useBooks } from "../context/BookContext";

export default function useChapterActions(bookId) {
  const { fetchBookById } = useBooks();

  const translateChapter = async (chapterId, targetLanguage = "hi") => {
    await api.translateChapter(chapterId, { target_language: targetLanguage });
    return fetchBookById(bookId);
  };

  const saveTranslatedText = async (chapterId, translatedText) => {
    await api.saveTranslatedText(chapterId, { translated_text: translatedText });
    return fetchBookById(bookId);
  };

  const replaceChapter = async (
    chapterId,
    replacements,
    sourceTextType = "translated"
  ) => {
    await api.replaceChapter(chapterId, {
      replacements,
      source_text_type: sourceTextType
    });
    return fetchBookById(bookId);
  };

  const saveReplacedText = async (chapterId, replacedText) => {
    await api.saveReplacedText(chapterId, { replaced_text: replacedText });
    return fetchBookById(bookId);
  };

  const generateChapterAudio = async (chapterId, payload) => {
    await api.generateChapterAudio(chapterId, {
      language: payload.language,
      speaker_id: payload.speaker_id,
      source_text_type: payload.source_text_type,
      accent: payload.accent
    });
    return fetchBookById(bookId);
  };

  return {
    translateChapter,
    saveTranslatedText,
    replaceChapter,
    saveReplacedText,
    generateChapterAudio
  };
}