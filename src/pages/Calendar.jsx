import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'

export default function Calendar() {

  const { user } = useAuth()

  const [items, setItems] =
    useState([])

  useEffect(() => {

    async function load() {

      const { data: trips } =
        await supabase
          .from('trips')
          .select('id')
          .eq('user_id', user.id)

      const ids =
        trips?.map(t => t.id) || []

      if (!ids.length) return

      const { data } =
        await supabase
          .from('itinerary_items')
          .select(`
            *,
            activities(name),
            trips(title)
          `)
          .in('trip_id', ids)
          .order('date')

      setItems(data || [])
    }

    load()

  }, [user.id])

  return (

    <div className="page">

      <h1>
        Calendar
      </h1>

      {items.length === 0 ? (

        <div className="empty">
          Your planned activities
          will appear here.
        </div>

      ) : (

        items.map(item => (

          <div
            className="card"
            key={item.id}
          >

            <strong>
              {item.date}
            </strong>

            <h3>
              {item.activities?.name}
            </h3>

            <Link
              to={`/trips/${item.trip_id}`}
            >
              {item.trips?.title}
            </Link>

          </div>

        ))

      )}

    </div>

  )
}