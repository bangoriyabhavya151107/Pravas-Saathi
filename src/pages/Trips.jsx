import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'

export default function Trips() {

  const { user } = useAuth()
  const [trips, setTrips] = useState([])

  async function loadTrips() {

    const { data, error } =
      await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date')

    if (!error) {
      setTrips(data)
    }
  }

  useEffect(() => {
    loadTrips()
  }, [])

  async function deleteTrip(id) {

    if (!confirm('Delete this trip?')) return

    await supabase
      .from('trips')
      .delete()
      .eq('id', id)

    loadTrips()
  }

  return (
    <div className="page">

      <div className="hero">

        <div>
          <span className="eyebrow">
            YOUR JOURNEYS
          </span>

          <h1>My Trips</h1>
        </div>

        <Link
          className="primary-btn"
          to="/trips/new"
        >
          + New Trip
        </Link>

      </div>

      <div className="grid">

        {trips.map(trip => (

          <div className="card" key={trip.id}>

            <div className="card-image">
              {trip.title.charAt(0)}
            </div>

            <h3>{trip.title}</h3>

            <p>
              {trip.start_date}
              {' → '}
              {trip.end_date}
            </p>

            <div
              style={{
                display: 'flex',
                gap: 10,
                padding: '0 18px'
              }}
            >

              <Link
                className="primary-btn"
                to={`/trips/${trip.id}`}
              >
                Open
              </Link>

              <button
                onClick={() =>
                  deleteTrip(trip.id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}