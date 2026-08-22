import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import { supabase } from '../lib/supabase'

const interestOptions = [
  'Food',
  'Heritage',
  'Nature',
  'Adventure',
  'Culture',
  'Beach',
  'Photography',
  'Shopping',
]

export default function Profile() {
  const [profile, setProfile] =
    useState({
      full_name: '',
      bio: '',
      home_city: '',
      travel_style: 'balanced',
      preferred_budget: 'moderate',
      interests: [],
    })

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [message, setMessage] =
    useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const {
      data,
      error,
    } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error(error)
    }

    if (data) {
      setProfile({
        full_name:
          data.full_name || '',
        bio:
          data.bio || '',
        home_city:
          data.home_city || '',
        travel_style:
          data.travel_style ||
          'balanced',
        preferred_budget:
          data.preferred_budget ||
          'moderate',
        interests:
          data.interests || [],
      })
    }

    setLoading(false)
  }

  function toggleInterest(
    interest
  ) {
    const exists =
      profile.interests.includes(
        interest
      )

    setProfile({
      ...profile,
      interests: exists
        ? profile.interests.filter(
            (item) =>
              item !== interest
          )
        : [
            ...profile.interests,
            interest,
          ],
    })
  }

  async function saveProfile(
    event
  ) {
    event.preventDefault()

    setSaving(true)
    setMessage('')

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage(
        'Your session has expired.'
      )

      setSaving(false)
      return
    }

    const {
      error,
    } = await supabase
      .from('profiles')
      .update({
        full_name:
          profile.full_name.trim(),
        bio:
          profile.bio.trim(),
        home_city:
          profile.home_city.trim(),
        travel_style:
          profile.travel_style,
        preferred_budget:
          profile.preferred_budget,
        interests:
          profile.interests,
      })
      .eq('id', user.id)

    if (error) {
      console.error(error)

      setMessage(
        error.message
      )

      setSaving(false)
      return
    }

    setMessage(
      'Profile updated successfully.'
    )

    setSaving(false)
  }

  if (loading) {
    return (
      <>
        <Navbar authenticated />

        <main className="dashboard-page">
          <div className="dashboard-loading">
            Loading profile...
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar authenticated />

      <main className="profile-page">
        <section className="profile-header">
          <span className="eyebrow">
            YOUR IDENTITY
          </span>

          <h1>
            Make Pravas Saathi
            <br />
            <em>travel with you.</em>
          </h1>

          <p>
            Tell us how you like to travel.
            These preferences can power
            better recommendations later.
          </p>
        </section>

        <form
          className="profile-form"
          onSubmit={saveProfile}
        >
          <section className="profile-card">
            <span className="eyebrow">
              BASIC INFORMATION
            </span>

            <div className="form-grid">
              <label>
                Full name

                <input
                  value={
                    profile.full_name
                  }
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      full_name:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Home city

                <input
                  value={
                    profile.home_city
                  }
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      home_city:
                        event.target.value,
                    })
                  }
                  placeholder="Ahmedabad"
                />
              </label>
            </div>

            <label>
              Short bio

              <textarea
                value={profile.bio}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    bio:
                      event.target.value,
                  })
                }
                placeholder="Tell us a little about yourself..."
                rows={5}
              />
            </label>
          </section>

          <section className="profile-card">
            <span className="eyebrow">
              TRAVEL PERSONALITY
            </span>

            <div className="form-grid">
              <label>
                Travel style

                <select
                  value={
                    profile.travel_style
                  }
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      travel_style:
                        event.target.value,
                    })
                  }
                >
                  <option value="slow">
                    Slow & mindful
                  </option>

                  <option value="balanced">
                    Balanced
                  </option>

                  <option value="adventure">
                    Adventure
                  </option>

                  <option value="luxury">
                    Comfort & luxury
                  </option>

                  <option value="budget">
                    Budget explorer
                  </option>
                </select>
              </label>

              <label>
                Preferred budget

                <select
                  value={
                    profile.preferred_budget
                  }
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      preferred_budget:
                        event.target.value,
                    })
                  }
                >
                  <option value="budget">
                    Budget
                  </option>

                  <option value="moderate">
                    Moderate
                  </option>

                  <option value="premium">
                    Premium
                  </option>

                  <option value="luxury">
                    Luxury
                  </option>
                </select>
              </label>
            </div>

            <div className="interest-section">
              <span>
                Interests
              </span>

              <div className="interest-grid">
                {interestOptions.map(
                  (interest) => {
                    const active =
                      profile.interests.includes(
                        interest
                      )

                    return (
                      <button
                        key={interest}
                        type="button"
                        className={
                          active
                            ? 'interest active'
                            : 'interest'
                        }
                        onClick={() =>
                          toggleInterest(
                            interest
                          )
                        }
                      >
                        {active
                          ? '✓ '
                          : ''}
                        {interest}
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          </section>

          <div className="profile-save-row">
            {message && (
              <span>
                {message}
              </span>
            )}

            <button
              type="submit"
              className="dashboard-primary-button"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save profile →'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}