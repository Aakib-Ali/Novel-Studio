import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { api } from '../api/api';

const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listBooks();
      setBooks(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookById = useCallback(async (bookId) => {
    setLoading(true);
    try {
      const data = await api.getBook(bookId);
      setCurrentBook(data);
      setBooks(prev => {
        const exists = prev.some(b => b.id === data.id);
        return exists ? prev.map(b => (b.id === data.id ? data : b)) : [data, ...prev];
      });
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const upsertBook = useCallback((book) => {
    setBooks(prev => {
      const exists = prev.some(item => item.id === book.id);
      return exists ? prev.map(item => (item.id === book.id ? book : item)) : [book, ...prev];
    });
    setCurrentBook(prev => (prev?.id === book.id ? book : prev));
  }, []);

  const value = useMemo(() => ({
    books,
    setBooks,
    currentBook,
    setCurrentBook,
    loading,
    fetchBooks,
    fetchBookById,
    upsertBook
  }), [books, currentBook, loading, fetchBooks, fetchBookById, upsertBook]);

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBooks() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBooks must be used within BookProvider');
  return ctx;
}