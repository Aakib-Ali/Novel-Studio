import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import api from "../api/api";
import { useNotificationsStream } from "../hooks/useNotificationsStream";

const NotificationContext = createContext(null);

function sortByUpdatedAt(items) {
  return [...items].sort(
    (a, b) => new Date(b.updated_at || b.updatedat || 0) - new Date(a.updated_at || a.updatedat || 0)
  );
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [centerOpen, setCenterOpen] = useState(false);

  const upsertNotification = useCallback((payload) => {
    if (!payload?.id) return;
    setNotifications((prev) => {
      const exists = prev.some((item) => item.id === payload.id);
      const next = exists
        ? prev.map((item) => (item.id === payload.id ? { ...item, ...payload } : item))
        : [payload, ...prev];
      return sortByUpdatedAt(next);
    });
  }, []);

  const pushToast = useCallback((payload) => {
    const toastId = `${payload.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast = { ...payload, toastId };
    setToasts((prev) => [...prev, toast]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.toastId !== toastId));
    }, 4200);
  }, []);

  useEffect(() => {
    api.listNotifications({ limit: 50 }).then((data) => {
      setNotifications(sortByUpdatedAt(Array.isArray(data) ? data : []));
    });
  }, []);

  useNotificationsStream((event) => {
    if (!event) return;
    const payload = event.payload || event;
    if (event.kind === "notification" || payload?.id) {
      upsertNotification(payload);
      if (["started", "completed", "failed"].includes(payload.status)) {
        pushToast(payload);
      }
    }
  });

  const value = useMemo(
    () => ({
      notifications,
      toasts,
      centerOpen,
      setCenterOpen,
      upsertNotification,
      pushToast
    }),
    [notifications, toasts, centerOpen, upsertNotification, pushToast]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}