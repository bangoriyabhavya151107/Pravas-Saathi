import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'

export default function Dashboard() {

  const { user } = useAuth()

  const [profile, setProfile] =
    useState(null)

  const [trips, setTrips] =
    useState([])

  useEffect(() => {

    async function load() {

      const { data: profileData } =
        await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

      const { data: tripData } =
        await supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', {
            ascending: true
          })
          .limit(5)

      setProfile(profileData)
      setTrips(tripData || [])
    }

    load()

  }, [user.id])

  const name =
    profile?.full_name ||
    user.email.split('@')[0]

  return (

    <div className="page">

      <div className="hero">

        <div>

          <span className="eyebrow">
            YOUR TRAVEL SPACE
          </span>

          <h1>
            Namaste, {name} ✦
          </h1>

          <p>
            Where will your next story take you?
          </p>

        </div>

        <Link
          className="primary-btn"
          to="/trips/new"
        >
          + Plan New Trip
        </Link>

      </div>

      <section>

        <h2>Recent journeys</h2>

        {trips.length === 0 ? (

          <div className="empty">

            <h3>
              Your map is waiting.
            </h3>

            <p>
              Create your first journey.
            </p>

            <Link
              className="primary-btn"
              to="/trips/new"
            >
              Create Trip
            </Link>

          </div>

        ) : (

          <div className="grid">

            {trips.map(trip => (

              <Link
                className="card"
                key={trip.id}
                to={`/trips/${trip.id}`}
              >

                <div className="card-image">
                  {trip.title.charAt(0)}
                </div>

                <h3>
                  {trip.title}
                </h3>

                <p>
                  {trip.start_date}
                  {' → '}
                  {trip.end_date}
                </p>

              </Link>

            ))}

          </div>

        )}

      </section>

    </div>
  )
}