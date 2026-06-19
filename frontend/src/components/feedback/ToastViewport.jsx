import { useNotifications } from '../../context/NotificationContext';

export default function ToastViewport() {
  const { toasts } = useNotifications();

  return (
    <div className="toast-viewport">
      {toasts.map(toast => (
        <div key={toast.toastId} className={`toast-card ${toast.status || 'completed'}`}>
          <strong>{toast.title}</strong>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}