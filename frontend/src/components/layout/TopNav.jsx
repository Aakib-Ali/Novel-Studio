import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

function Logo() {
  return (
    <svg className="brand-logo" viewBox="0 0 48 48" aria-label="Novel Studio">
      <rect x="6" y="8" width="12" height="32" rx="3" />
      <rect x="20" y="12" width="10" height="28" rx="3" />
      <path d="M34 10c4 3 8 7 8 14s-4 11-8 14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

export default function TopNav() {
  const { notifications, drawerOpen, setDrawerOpen } = useNotifications();
  const location = useLocation();
  const pending = notifications.filter(n => ['queued', 'running', 'started'].includes(n.status)).length;

  return (
    <header className="top-nav">
      <div className="top-nav-left">
        <Link to="/" className="brand">
          <Logo />
          <div>
            <strong>Novel Studio</strong>
            <span>Publishing operations</span>
          </div>
        </Link>
      </div>

      <div className="top-nav-right">
        <span className="route-chip">{location.pathname === '/' ? 'Library' : 'Book workspace'}</span>
        <button className="icon-button" onClick={() => setDrawerOpen(!drawerOpen)}>
          <span>Activity</span>
          {pending > 0 && <b className="nav-counter">{pending}</b>}
        </button>
      </div>
    </header>
  );
}