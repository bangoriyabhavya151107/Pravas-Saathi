export default function ActivityCard({
  activity,
}) {
  return (
    <article className="activity-card">
      <div className="activity-icon">
        {activity.category === 'food'
          ? '🍜'
          : activity.category === 'nature'
            ? '🌿'
            : activity.category === 'adventure'
              ? '⛰️'
              : activity.category === 'beach'
                ? '🌊'
                : '🏛️'}
      </div>

      <div className="activity-content">
        <span className="activity-category">
          {activity.category}
        </span>

        <h3>{activity.name}</h3>

        <p>
          {activity.description}
        </p>

        <div className="activity-meta">
          <span>
            ⏱ {activity.duration_minutes} min
          </span>

          <span>
            ₹{activity.estimated_cost}
          </span>
        </div>
      </div>
    </article>
  )
}