import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import PlanningTip from '../components/PlanningTip'

import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [profile, setProfile] =
    useState(null)

  const [trips, setTrips] =
    useState([])

  const [tips, setTips] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)
    setError('')

    try {
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('User session not found.')
        return
      }

      const [
        profileResponse,
        tripsResponse,
        tipsResponse,
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),

        supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .order(
            'created_at',
            { ascending: false }
          ),

        supabase
          .from('planning_tips')
          .select('*')
          .order(
            'priority',
            { ascending: false }
          )
          .limit(3),
      ])

      if (profileResponse.error) {
        throw profileResponse.error
      }

      if (tripsResponse.error) {
        throw tripsResponse.error
      }

      if (tipsResponse.error) {
        throw tipsResponse.error
      }

      setProfile(
        profileResponse.data
      )

      setTrips(
        tripsResponse.data || []
      )

      setTips(
        tipsResponse.data || []
      )
    } catch (err) {
      console.error(err)

      setError(
        err.message ||
        'Unable to load dashboard.'
      )
    } finally {
      setLoading(false)
    }
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

  const firstName =
    profile?.full_name
      ?.split(' ')[0] ||
    'Traveller'

  return (
    <>
      <Navbar authenticated />

      <main className="dashboard-page">
        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">
              YOUR TRAVEL SPACE
            </span>

            <h1>
              Good day,
              <br />
              {firstName}.
            </h1>

            <p>
              Ready to plan your next story?
            </p>
          </div>

          <Link
            to="/explore"
            className="dashboard-primary-button"
          >
            Explore destinations →
          </Link>
        </section>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <section className="stats-grid">
          <StatCard
            label="JOURNEYS"
            value={trips.length}
            description="Your planned trips"
          />

          <StatCard
            label="TRAVEL STYLE"
            value={
              profile?.travel_style ||
              'Balanced'
            }
            description="Your preference"
          />

          <StatCard
            label="BUDGET"
            value={
              profile?.preferred_budget ||
              'Moderate'
            }
            description="Your preference"
          />

          <StatCard
            label="PROFILE"
            value={
              profile?.home_city
                ? 'Complete'
                : 'Finish'
            }
            description="Personalize your experience"
          />
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                YOUR JOURNEYS
              </span>

              <h2>
                Where are you going?
              </h2>
            </div>

            <Link to="/explore">
              Discover more →
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="empty-state">
              <span>🧭</span>

              <h3>
                Your next journey is waiting.
              </h3>

              <p>
                Explore destinations and start
                building your first trip.
              </p>

              <Link to="/explore">
                Explore destinations
              </Link>
            </div>
          ) : (
            <div className="trip-grid">
              {trips.map((trip) => (
                <article
                  className="trip-card"
                  key={trip.id}
                >
                  <span>
                    JOURNEY
                  </span>

                  <h3>
                    {trip.name ||
                      'Untitled trip'}
                  </h3>

                  <p>
                    {trip.description ||
                      'Your Pravas Saathi journey.'}
                  </p>

                  {trip.start_date && (
                    <small>
                      {trip.start_date}
                    </small>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                PERSONALIZED FOR YOU
              </span>

              <h2>
                A little travel wisdom.
              </h2>
            </div>
          </div>

          <div className="tips-grid">
            {tips.map((tip) => (
              <PlanningTip
                key={tip.id}
                tip={tip}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}