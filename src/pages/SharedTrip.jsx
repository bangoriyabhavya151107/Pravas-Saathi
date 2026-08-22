import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SharedTrip() {

  const { id } = useParams()

  const [trip, setTrip] =
    useState(null)

  const [items, setItems] =
    useState([])

  useEffect(() => {

    async function load() {

      const { data: trip } =
        await supabase
          .from('trips')
          .select('*')
          .eq('id', id)
          .eq('is_public', true)
          .single()

      if (!trip) return

      const { data: items } =
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

      setTrip(trip)
      setItems(items || [])
    }

    load()

  }, [id])

  if (!trip) {
    return (
      <div className="page">
        This trip is private or does not exist.
      </div>
    )
  }

  return (

    <div className="page">

      <span className="eyebrow">
        SHARED JOURNEY
      </span>

      <h1>
        {trip.title}
      </h1>

      <p>
        {trip.description}
      </p>

      <p>
        {trip.start_date}
        {' → '}
        {trip.end_date}
      </p>

      {items.map(item => (

        <div
          className="card"
          key={item.id}
        >

          <h3>
            {item.activities?.name}
          </h3>

          <p>
            {item.trip_stops?.cities?.name}
          </p>

        </div>

      ))}

    </div>

  )
}