export default function StatsCard({ title, value, icon, color = '#c9a96e' }) {
  return (
    <div className="stats-card">
      <div className="stats-card-icon" style={{ background: color + '18', color }}>{icon}</div>
      <div>
        <div className="stats-card-value">{value}</div>
        <div className="stats-card-title">{title}</div>
      </div>
    </div>
  );
}
