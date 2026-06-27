import MetricCard from "../shared/MetricCard";

export default function KPIGrid({ items }) {
  return (
    <section className="kpi-grid">
      {items.map((item) => (
        <MetricCard key={item.label} item={item} />
      ))}
    </section>
  );
}