import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { useBooks } from '../context/BookContext';

export function useJobPolling(bookId) {
  const { fetchBookById } = useBooks();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!bookId) return;

    let active = true;
    let timerId = null;

    const load = async () => {
      try {
        const data = await api.listJobs({ book_id: bookId, active_only: true });
        if (!active) return;

        setJobs(data);

        if (data.length > 0) {
          await fetchBookById(bookId);
        }

        if (active) {
          timerId = setTimeout(load, data.length > 0 ? 2500 : 5000);
        }
      } catch (error) {
        if (active) {
          timerId = setTimeout(load, 5000);
        }
      }
    };

    load();

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [bookId, fetchBookById]);

  return jobs;
}