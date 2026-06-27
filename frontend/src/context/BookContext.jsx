import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../api/api";

const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listBooks();
      setBooks(Array.isArray(data) ? data : []);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookById = useCallback(async (bookId) => {
    if (!bookId) return null;
    setLoading(true);
    try {
      const data = await api.getBook(bookId);
      setCurrentBook(data);
      setBooks((prev) => {
        const exists = prev.some((item) => item.id === data.id);
        if (exists) {
          return prev.map((item) => (item.id === data.id ? data : item));
        }
        return [data, ...prev];
      });
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCurrentBook = useCallback(() => {
    setCurrentBook(null);
  }, []);

  const value = useMemo(
    () => ({
      books,
      setBooks,
      currentBook,
      setCurrentBook,
      clearCurrentBook,
      loading,
      fetchBooks,
      fetchBookById
    }),
    [books, currentBook, loading, fetchBooks, fetchBookById, clearCurrentBook]
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within BookProvider");
  }
  return context;
}