import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const client = axios.create({
     baseURL: API_BASE_URL
});

export const api = {
     client,
     baseURL: API_BASE_URL,
     eventsURL: `${API_BASE_URL}/stream/events`,
     listBooks: () => client.get('/books').then(r => r.data),
     getBook: (bookId) => client.get(`/books/${bookId}`).then(r => r.data),
     createBook: (formData, config = {}) => client.post('/books', formData, config).then(r => r.data),
     uploadChapter: (bookId, formData, config = {}) => client.post(`/books/${bookId}/chapters`, formData, config).then(r => r.data),
     getChapter: (chapterId) => client.get(`/chapters/${chapterId}`).then(r => r.data),
     translateBook: (bookId, payload) => client.post(`/translation/books/${bookId}`, payload).then(r => r.data),
     translateChapter: (chapterId, payload) => client.post(`/translation/chapters/${chapterId}`, payload).then(r => r.data),
     replaceBook: (bookId, payload) => client.post(`/replacement/books/${bookId}`, payload).then(r => r.data),
     replaceChapter: (chapterId, payload) => client.post(`/replacement/chapters/${chapterId}`, payload).then(r => r.data),
     saveTranslatedText: (chapterId, payload) => client.put(`/chapters/${chapterId}/translated-text`, payload).then(r => r.data),
     saveReplacedText: (chapterId, payload) => client.put(`/chapters/${chapterId}/replaced-text`, payload).then(r => r.data),
     generateBookAudio: (bookId, payload) => client.post(`/audio/books/${bookId}`, payload).then(r => r.data),
     generateChapterAudio: (chapterId, payload) => client.post(`/audio/chapters/${chapterId}`, payload).then(r => r.data),
     listChapterAudio: (chapterId) => client.get(`/audio/chapters/${chapterId}`).then(r => r.data),
     listSpeakers: () => client.get('/speakers').then(r => r.data),
     listJobs: (params = {}) => client.get('/jobs', { params }).then(r => r.data),
     getJob: (jobId) => client.get(`/jobs/${jobId}`).then(r => r.data),
     listNotifications: (params = {}) => client.get('/notifications', { params }).then(r => r.data)
};