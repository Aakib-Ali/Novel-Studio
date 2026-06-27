import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { getTheme, toggleTheme } from "../../utils/storage";

function Logo() {
  return (
    <svg viewBox="0 0 48 48" className="ns-logo" aria-label="Novel Studio">
      <rect x="5" y="9" width="10" height="30" rx="3" />
      <rect x="18" y="12" width="10" height="27" rx="3" />
      <path
        d="M33 10c4 3 8 7 8 14s-4 11-8 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Topbar() {
  const location = useLocation();
  const { centerOpen, setCenterOpen, notifications } = useNotifications();

  const activeCount = notifications.filter((item) =>
    ["queued", "started", "running", "processing"].includes(item.status)
  ).length;

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <header className="ns-topbar">
      <Link to="/" className="ns-brand">
        <Logo />
        <div>
          <strong>Novel Studio</strong>
          <span>Editorial production workspace</span>
        </div>
      </Link>

      <div className="ns-topbar-actions">
        <span className="ns-chip">
          {location.pathname === "/" ? "Library" : "Book workspace"}
        </span>

        <button
          className="ns-icon-btn"
          type="button"
          onClick={handleThemeToggle}
          aria-label={`Current theme ${getTheme()}. Toggle theme`}
        >
          Theme
        </button>

        <button
          className="ns-icon-btn"
          type="button"
          onClick={() => setCenterOpen(!centerOpen)}
          aria-label="Open activity center"
        >
          Activity {activeCount > 0 ? <b>{activeCount}</b> : null}
        </button>
      </div>
    </header>
  );
}