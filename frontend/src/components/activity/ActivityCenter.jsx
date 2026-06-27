import { useNotifications } from "../../context/NotificationContext";
import { formatDateTime, formatStatus } from "../../utils/format";

export default function ActivityCenter({ compact = false }) {
  const { notifications, centerOpen, setCenterOpen } = useNotifications();

  return (
    <aside
      className={`activity-center ${compact ? "compact" : ""} ${
        compact || centerOpen ? "open" : ""
      }`}
    >
      <div className="section-top">
        <div>
          <h3>Activity</h3>
          <p>Uploads, translation, replacements, and audio generation.</p>
        </div>

        {!compact ? (
          <button className="ns-icon-btn" type="button" onClick={() => setCenterOpen(false)}>
            Close
          </button>
        ) : null}
      </div>

      <div className="activity-list">
        {notifications.map((item) => {
          const progress = item.progress ?? 0;

          return (
            <article key={item.id} className="activity-card">
              <div className="card-row">
                <span className={`ns-badge ${item.status}`}>{formatStatus(item.status)}</span>
                <small>{formatDateTime(item.updated_at || item.updatedat)}</small>
              </div>

              <h4>{item.title}</h4>
              <p>{item.message}</p>

              {progress > 0 && progress < 100 ? (
                <div className="ns-progress">
                  <div style={{ width: `${progress}%` }} />
                </div>
              ) : null}
            </article>
          );
        })}

        {!notifications.length ? (
          <div className="empty-inline">No recent activity yet.</div>
        ) : null}
      </div>
    </aside>
  );
}