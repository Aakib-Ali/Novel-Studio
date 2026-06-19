import { useNotifications } from '../../context/NotificationContext';
import { formatDateTime, formatStatus } from '../../utils/format';

export default function ActivityDrawer() {
  const { drawerOpen, setDrawerOpen, notifications } = useNotifications();

  return (
    <aside className={`activity-drawer ${drawerOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <div>
          <h3>Activity center</h3>
          <p>Uploads, translation, replacement, and audio jobs.</p>
        </div>
        <button className="icon-button" onClick={() => setDrawerOpen(false)}>Close</button>
      </div>

      <div className="drawer-list">
        {notifications.map(item => (
          <article key={item.id} className="activity-item">
            <div className="activity-top">
              <span className={`status-pill ${item.status}`}>{formatStatus(item.status)}</span>
              <small>{formatDateTime(item.updated_at)}</small>
            </div>
            <h4>{item.title}</h4>
            <p>{item.message}</p>
            {(item.progress ?? 0) > 0 && item.progress < 100 && (
              <div className="progress-shell">
                <div className="progress-bar" style={{ width: `${item.progress}%` }} />
              </div>
            )}
          </article>
        ))}
      </div>
    </aside>
  );
}