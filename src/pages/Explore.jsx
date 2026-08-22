import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'
import ActivityCard from '../components/ActivityCard'

import { supabase } from '../lib/supabase'

export default function Explore() {
  const [cities, setCities] =
    useState([])

  const [activities, setActivities] =
    useState([])

  const [selectedCity, setSelectedCity] =
    useState('all')

  const [category, setCategory] =
    useState('all')

  const [search, setSearch] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    loadExplore()
  }, [])

  async function loadExplore() {
    setLoading(true)

    const [
      citiesResponse,
      activitiesResponse,
    ] = await Promise.all([
      supabase
        .from('cities')
        .select('*')
        .order('popularity', {
          ascending: false,
        }),

      supabase
        .from('activities')
        .select(`
          *,
          cities (
            name
          )
        `)
        .order('name'),
    ])

    if (citiesResponse.error) {
      console.error(
        citiesResponse.error
      )
    }

    if (activitiesResponse.error) {
      console.error(
        activitiesResponse.error
      )
    }

    setCities(
      citiesResponse.data || []
    )

    setActivities(
      activitiesResponse.data || []
    )

    setLoading(false)
  }

  const filteredActivities =
    activities.filter((activity) => {
      const matchesCity =
        selectedCity === 'all' ||
        activity.city_id === selectedCity

      const matchesCategory =
        category === 'all' ||
        activity.category === category

      const searchValue =
        search.toLowerCase()

      const matchesSearch =
        !searchValue ||
        activity.name
          ?.toLowerCase()
          .includes(searchValue) ||
        activity.description
          ?.toLowerCase()
          .includes(searchValue)

      return (
        matchesCity &&
        matchesCategory &&
        matchesSearch
      )
    })

  return (
    <>
      <Navbar authenticated />

      <main className="explore-page">
        <section className="explore-header">
          <span className="eyebrow">
            DISCOVER
          </span>

          <h1>
            Find your
            <br />
            next place.
          </h1>

          <p>
            Explore destinations and experiences
            for your next journey.
          </p>
        </section>

        <section className="city-strip">
          {cities.map((city) => (
            <button
              key={city.id}
              type="button"
              className={
                selectedCity === city.id
                  ? 'city-pill active'
                  : 'city-pill'
              }
              onClick={() =>
                setSelectedCity(
                  city.id
                )
              }
            >
              {city.name}
            </button>
          ))}

          <button
            type="button"
            className={
              selectedCity === 'all'
                ? 'city-pill active'
                : 'city-pill'
            }
            onClick={() =>
              setSelectedCity('all')
            }
          >
            All
          </button>
        </section>

        <section className="explore-controls">
          <input
            type="search"
            placeholder="Search activities..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
          >
            <option value="all">
              All categories
            </option>

            <option value="heritage">
              Heritage
            </option>

            <option value="food">
              Food
            </option>

            <option value="nature">
              Nature
            </option>

            <option value="adventure">
              Adventure
            </option>

            <option value="culture">
              Culture
            </option>

            <option value="beach">
              Beach
            </option>
          </select>
        </section>

        {loading ? (
          <div className="dashboard-loading">
            Discovering experiences...
          </div>
        ) : (
          <section className="activity-grid">
            {filteredActivities.length ===
            0 ? (
              <div className="empty-state">
                <span>🔎</span>

                <h3>
                  Nothing found.
                </h3>

                <p>
                  Try changing your filters.
                </p>
              </div>
            ) : (
              filteredActivities.map(
                (activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                  />
                )
              )
            )}
          </section>
        )}
      </main>
    </>
  )
}