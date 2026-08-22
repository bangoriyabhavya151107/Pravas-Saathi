import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import Navbar from '../components/Navbar'

import AddStop from '../components/trips/AddStop'
import AddActivity from '../components/trips/AddActivity'
import AddExpense from '../components/trips/AddExpense'
import StopCard from '../components/trips/StopCard'
import TripOverview from '../components/trips/TripOverview'

import { supabase } from '../lib/supabase'

export default function TripDetailsPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()

  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [activities, setActivities] = useState([])

  const [showStopForm, setShowStopForm] =
    useState(false)

  const [activityStop, setActivityStop] =
    useState(null)

  const [showExpense, setShowExpense] =
    useState(false)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    loadTrip()
  }, [tripId])

  async function loadTrip() {
    setLoading(true)
    setError('')

    try {
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser()

      if (!user) {
        navigate('/login')
        return
      }

      const {
        data: tripData,
        error: tripError,
      } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .eq('user_id', user.id)
        .single()

      if (tripError) {
        throw tripError
      }

      const {
        data: stopsData,
        error: stopsError,
      } = await supabase
        .from('trip_stops')
        .select('*')
        .eq('trip_id', tripId)
        .order(
          'position',
          {
            ascending: true,
          }
        )

      if (stopsError) {
        throw stopsError
      }

      let activitiesData = []

      const stopIds =
        (stopsData || []).map(
          (stop) => stop.id
        )

      if (stopIds.length > 0) {
        const {
          data,
          error: activitiesError,
        } = await supabase
          .from('trip_activities')
          .select('*')
          .in(
            'stop_id',
            stopIds
          )
          .order(
            'activity_date',
            {
              ascending: true,
            }
          )

        if (activitiesError) {
          throw activitiesError
        }

        activitiesData = data || []
      }

      setTrip(tripData)
      setStops(stopsData || [])
      setActivities(activitiesData)
    } catch (err) {
      console.error(err)

      setError(
        err.message ||
        'Unable to load this journey.'
      )
    } finally {
      setLoading(false)
    }
  }

  function activitiesForStop(stopId) {
    return activities.filter(
      (activity) =>
        activity.stop_id === stopId
    )
  }

  function handleStopAdded(stop) {
    setStops((current) => [
      ...current,
      stop,
    ])

    setShowStopForm(false)
  }

  function handleActivityAdded(activity) {
    setActivities((current) => [
      ...current,
      activity,
    ])

    setActivityStop(null)
  }

  if (loading) {
    return (
      <>
        <Navbar authenticated />

        <main className="dashboard-page">
          <div className="dashboard-loading">
            Loading your journey...
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar authenticated />

        <main className="dashboard-page">

          <div className="dashboard-error">
            {error}
          </div>

          <button
            type="button"
            onClick={loadTrip}
          >
            Try again
          </button>

        </main>
      </>
    )
  }

  if (!trip) {
    return (
      <>
        <Navbar authenticated />

        <main className="dashboard-page">

          <div className="empty-state">

            <span>🧭</span>

            <h3>
              Journey not found.
            </h3>

            <Link to="/dashboard">
              Back to dashboard
            </Link>

          </div>

        </main>
      </>
    )
  }

  return (
    <>
      <Navbar authenticated />

      <main className="trip-details-page">

        <div className="trip-details-topbar">

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate('/dashboard')
            }
          >
            ← Dashboard
          </button>

        </div>

        <TripOverview
          trip={trip}
          stops={stops}
          activities={activities}
        />

        <section className="trip-actions">

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              setShowStopForm(
                (current) => !current
              )
            }
          >
            + Add Stop
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setShowExpense(
                (current) => !current
              )
            }
          >
            ₹ Add Expense
          </button>

        </section>

        {showStopForm && (
          <section className="form-panel">

            <AddStop
              tripId={tripId}
              onAdded={handleStopAdded}
            />

          </section>
        )}

        {showExpense && (
          <section className="form-panel">

            <AddExpense
              tripId={tripId}
              onAdded={() =>
                setShowExpense(false)
              }
            />

          </section>
        )}

        {activityStop && (
          <section className="form-panel">

            <AddActivity
              stopId={activityStop.id}
              onAdded={
                handleActivityAdded
              }
            />

          </section>
        )}

        <section className="stops-section">

          <div className="section-heading">

            <div>

              <span className="eyebrow">
                ITINERARY
              </span>

              <h2>
                Your journey.
              </h2>

            </div>

          </div>

          {stops.length === 0 ? (

            <div className="empty-state">

              <span>📍</span>

              <h3>
                Your journey starts here.
              </h3>

              <p>
                Add your first destination
                and start building your
                itinerary.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowStopForm(true)
                }
              >
                Add your first stop →
              </button>

            </div>

          ) : (

            <div className="stops-list">

              {stops.map(
                (stop, index) => (

                  <StopCard
                    key={stop.id}
                    stop={{
                      ...stop,
                      position:
                        index + 1,
                    }}
                    activities={
                      activitiesForStop(
                        stop.id
                      )
                    }
                    onAddActivity={
                      setActivityStop
                    }
                  />

                )
              )}

            </div>

          )}

        </section>

      </main>
    </>
  )
}