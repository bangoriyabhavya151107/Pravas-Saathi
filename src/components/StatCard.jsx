export default function StatCard({
  label,
  value,
  description,
}) {
  return (
    <div className="stat-card">
      <span>{label}</span>

      <strong>{value}</strong>

      {description && (
        <small>{description}</small>
      )}
    </div>
  )
}