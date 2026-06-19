export default function MetricsStrip({ items, compact = false }) {
  return (
    <section className={`metrics-strip ${compact ? 'compact' : ''}`}>
      {items.map(item => (
        <div key={item.label} className="metric-card">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <small>{item.note}</small>
        </div>
      ))}
    </section>
  );
}