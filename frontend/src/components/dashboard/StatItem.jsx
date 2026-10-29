export default function StatItem({ label, value }) {
  return (
    <div className="stat-item">
      <p className="stat-label">{label}</p>
      <div className="stat-value">{value}</div>
    </div>
  );
}