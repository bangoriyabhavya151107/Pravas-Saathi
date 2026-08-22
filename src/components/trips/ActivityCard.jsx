export default function ActivityCard({ activity }) {
  return (
    <article className="activity-card">

      <div className="activity-card-icon">
        ✦
      </div>

      <div className="activity-card-content">

        <div className="activity-card-top">
          <span className="activity-category">
            {activity.category || "Activity"}
          </span>

          {activity.cost > 0 && (
            <strong>
              ₹{Number(activity.cost).toLocaleString("en-IN")}
            </strong>
          )}
        </div>

        <h4>{activity.name}</h4>

        {activity.description && (
          <p>{activity.description}</p>
        )}

        <div className="activity-card-meta">

          {activity.activity_date && (
            <span>
              📅 {activity.activity_date}
            </span>
          )}

          {activity.start_time && (
            <span>
              🕐 {activity.start_time}
            </span>
          )}

          {activity.duration_minutes && (
            <span>
              ⏱ {activity.duration_minutes} min
            </span>
          )}

        </div>

      </div>

    </article>
  );
}