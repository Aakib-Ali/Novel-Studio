import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="surface-card empty-state">
      <div className="empty-icon">404</div>
      <h3>Page not found</h3>
      <p>The requested workspace view does not exist.</p>
      <Link className="btn ns-btn ns-btn-primary" to="/">Back to library</Link>
    </div>
  );
}