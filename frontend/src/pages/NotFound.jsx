import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="ns-surface not-found-card">
      <h1>Page not found</h1>
      <p>The requested workspace page does not exist.</p>
      <Link className="ns-btn ns-btn-primary" to="/">
        Back to library
      </Link>
    </div>
  );
}