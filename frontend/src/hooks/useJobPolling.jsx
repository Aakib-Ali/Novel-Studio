import { useEffect, useRef, useState } from "react";
import api from "../api/api";

export default function useJobPolling(bookId, onRefresh) {
  const [jobs, setJobs] = useState([]);
  const previousStatusesRef = useRef({});

  useEffect(() => {
    if (!bookId) return;

    let active = true;

    const load = async () => {
      try {
        const result = await api.listJobs({
          book_id: bookId,
          active_only: false
        });

        if (!active) return;

        const safeJobs = Array.isArray(result) ? result : [];
        setJobs(safeJobs);

        let shouldRefreshBook = false;
        const previousStatuses = previousStatusesRef.current;

        for (const job of safeJobs) {
          const previousStatus = previousStatuses[job.id];
          const currentStatus = job.status;

          if (
            previousStatus &&
            previousStatus !== currentStatus &&
            currentStatus === "completed"
          ) {
            shouldRefreshBook = true;
          }

          previousStatuses[job.id] = currentStatus;
        }

        if (shouldRefreshBook && onRefresh) {
          await onRefresh(bookId);
        }
      } catch (error) {
        console.error("Job polling failed:", error);
      }
    };

    load();
    const timer = setInterval(load, 2500);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [bookId, onRefresh]);

  return jobs;
}