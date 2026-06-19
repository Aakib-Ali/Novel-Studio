export default function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="spinner-ring" />
        <p>Processing request...</p>
      </div>
    </div>
  );
}