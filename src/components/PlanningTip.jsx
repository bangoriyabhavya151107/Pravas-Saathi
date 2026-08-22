export default function PlanningTip({
  tip,
}) {
  return (
    <article className="planning-tip">
      <div className="planning-tip-icon">
        {tip.icon || '🧭'}
      </div>

      <div>
        <span>PLANNING TIP</span>

        <h3>{tip.title}</h3>

        <p>{tip.description}</p>
      </div>
    </article>
  )
}