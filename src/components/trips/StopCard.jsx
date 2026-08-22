import ActivityCard from "./ActivityCard";

export default function StopCard({
  stop,
  activities = [],
  onAddActivity,
}) {
  return (
    <article className="stop-card">

      <div className="stop-number">
        {stop.position}
      </div>

      <div className="stop-content">

        <div className="stop-heading">

          <div>
            <span className="stop-label">
              STOP {stop.position}
            </span>

            <h3>
              {stop.city}

              {stop.country && (
                <span className="stop-country">
                  {" "}
                  · {stop.country}
                </span>
              )}
            </h3>
          </div>

          <button
            type="button"
            className="small-button"
            onClick={() => onAddActivity(stop)}
          >
            + Activity
          </button>

        </div>

        <div className="stop-dates">

          <span>
            {stop.arrival_date || "Arrival TBD"}
          </span>

          <span>→</span>

          <span>
            {stop.departure_date || "Departure TBD"}
          </span>

        </div>

        {stop.notes && (
          <p className="stop-notes">
            {stop.notes}
          </p>
        )}

        <div className="activity-list">

          {activities.length === 0 ? (
            <div className="empty-mini">
              No activities yet. Add something to this stop.
            </div>
          ) : (
            activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))
          )}

        </div>

      </div>

    </article>
  );
}