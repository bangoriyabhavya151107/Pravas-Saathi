import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Itinerary() {

  const { id } = useParams()

  const [trip, setTrip] =
    useState(null)

  const [items, setItems] =
    useState([])

  useEffect(() => {

    async function load() {

      const tripResult =
        await supabase
          .from('trips')
          .select('*')
          .eq('id', id)
          .single()

      const itemResult =
        await supabase
          .from('itinerary_items')
          .select(`
            *,
            activities (
              name,
              category,
              estimated_cost
            ),
            trip_stops (
              cities (
                name,
                country
              )
            )
          `)
          .eq('trip_id', id)
          .order('date')
          .order('start_time')

      setTrip(tripResult.data)
      setItems(itemResult.data || [])
    }

    load()

  }, [id])

  if (!trip) {
    return <div className="page">
      Loading...
    </div>
  }

  return (
    <div className="page">

      <Link to={`/trips/${id}`}>
        ← Trip
      </Link>

      <h1>
        {trip.title}
      </h1>

      {items.length === 0 ? (

        <div className="empty">
          No activities yet.
        </div>

      ) : (

        items.map(item => (

          <article
            className="card"
            key={item.id}
          >

            <p>
              {item.date}
            </p>

            <h3>
              {item.activities?.name}
            </h3>

            <p>
              {item.trip_stops?.cities?.name}
            </p>

            <span>
              {item.activities?.category}
            </span>

          </article>

        ))

      )}

    </div>
  )
}