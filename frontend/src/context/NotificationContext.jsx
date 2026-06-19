import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import { useNotificationsStream } from '../hooks/useNotificationsStream';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const upsertNotification = (item) => {
    setNotifications(prev => {
      const exists = prev.some(n => n.id === item.id);
      return exists
        ? prev.map(n => n.id === item.id ? { ...n, ...item } : n).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        : [item, ...prev].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    });
  };

  const pushToast = (item) => {
    const id = `${item.id || Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...item, toastId: id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.toastId !== id)), 4000);
  };

  useEffect(() => {
    api.listNotifications({ limit: 40 }).then(setNotifications);
  }, []);

  useNotificationsStream((event) => {
    if (event.kind === 'notification' && event.payload) {
      upsertNotification(event.payload);
      if (['completed', 'failed', 'started'].includes(event.payload.status)) {
        pushToast({
          id: event.payload.id,
          title: event.payload.title,
          message: event.payload.message,
          status: event.payload.status
        });
      }
    }
  });

  const value = useMemo(() => ({
    notifications,
    setNotifications,
    upsertNotification,
    toasts,
    drawerOpen,
    setDrawerOpen
  }), [notifications, toasts, drawerOpen]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}