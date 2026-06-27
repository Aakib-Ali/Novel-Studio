export default function MetricCard({ item }) {
  return (
    <article className="metric-card-v2">
      <span>{item.label}</span>
      <strong>{item.value}</strong>
      <small>{item.note}</small>
    </article>
  );
}