import { api } from '../api/api';
import { useBooks } from '../context/BookContext';

export function useChapterActions(bookId) {
  const { fetchBookById } = useBooks();

  const refresh = () => fetchBookById(bookId);

  const translateChapter = async (chapterId, targetLanguage = 'hi') => {
    await api.translateChapter(chapterId, { target_language: targetLanguage });
    return refresh();
  };

  const saveTranslatedText = async (chapterId, translatedText) => {
    await api.saveTranslatedText(chapterId, { translated_text: translatedText });
    return refresh();
  };

  const replaceChapter = async (chapterId, replacements, sourceTextType = 'translated') => {
    await api.replaceChapter(chapterId, { replacements, source_text_type: sourceTextType });
    return refresh();
  };

  const saveReplacedText = async (chapterId, replacedText) => {
    await api.saveReplacedText(chapterId, { replaced_text: replacedText });
    return refresh();
  };

  const generateChapterAudio = async (chapterId, payload) => {
    await api.generateChapterAudio(chapterId, payload);
    return refresh();
  };

  return {
    translateChapter,
    saveTranslatedText,
    replaceChapter,
    saveReplacedText,
    generateChapterAudio
  };
}