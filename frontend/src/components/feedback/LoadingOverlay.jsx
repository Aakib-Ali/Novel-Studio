export default function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="spinner-dot" />
        <p>Processing request...</p>
      </div>
    </div>
  );
}