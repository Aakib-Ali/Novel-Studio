export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state-v2">
      <div className="empty-mark">NS</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel ? (
        <button className="ns-btn ns-btn-primary" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}