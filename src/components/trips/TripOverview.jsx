export default function TripOverview({
  trip,
  stops = [],
  activities = [],
}) {
  const activityCost =
    activities.reduce(
      (total, activity) =>
        total +
        Number(activity.cost || 0),
      0
    )

  const budget =
    Number(trip?.budget || 0)

  const percentage =
    budget > 0
      ? Math.min(
          (activityCost / budget) * 100,
          100
        )
      : 0

  return (
    <section className="trip-overview">

      <div className="trip-overview-header">

        <span className="eyebrow">
          YOUR JOURNEY
        </span>

        <h1>
          {trip?.name ||
            'Untitled journey'}
        </h1>

        {trip?.description && (
          <p>
            {trip.description}
          </p>
        )}

      </div>

      <div className="trip-overview-stats">

        <div className="overview-stat">

          <span>
            STOPS
          </span>

          <strong>
            {stops.length}
          </strong>

        </div>

        <div className="overview-stat">

          <span>
            ACTIVITIES
          </span>

          <strong>
            {activities.length}
          </strong>

        </div>

        <div className="overview-stat">

          <span>
            BUDGET
          </span>

          <strong>
            ₹
            {budget.toLocaleString(
              'en-IN'
            )}
          </strong>

        </div>

        <div className="overview-stat">

          <span>
            PLANNED COST
          </span>

          <strong>
            ₹
            {activityCost.toLocaleString(
              'en-IN'
            )}
          </strong>

        </div>

      </div>

      {budget > 0 && (
        <div className="budget-progress">

          <div className="budget-progress-top">

            <span>
              Planned activity budget
            </span>

            <strong>
              {Math.round(
                percentage
              )}
              %
            </strong>

          </div>

          <div className="budget-progress-track">

            <div
              className="budget-progress-fill"
              style={{
                width:
                  `${percentage}%`,
              }}
            />

          </div>

        </div>
      )}

    </section>
  )
}