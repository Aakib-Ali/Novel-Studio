import { useNotifications } from "../../context/NotificationContext";

export default function ToastStack() {
  const { toasts } = useNotifications();

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.toastId} className={`toast-item ${toast.status || "info"}`}>
          <strong>{toast.title}</strong>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}