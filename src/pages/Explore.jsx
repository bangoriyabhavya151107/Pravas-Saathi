import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Explore() {

  const [cities, setCities] =
    useState([])

  const [activities, setActivities] =
    useState([])

  const [search, setSearch] =
    useState('')

  useEffect(() => {

    async function load() {

      const citiesResult =
        await supabase
          .from('cities')
          .select('*')
          .order('popularity', {
            ascending: false
          })

      const activitiesResult =
        await supabase
          .from('activities')
          .select('*')
          .order('name')

      setCities(citiesResult.data || [])
      setActivities(
        activitiesResult.data || []
      )
    }

    load()

  }, [])

  const filtered =
    cities.filter(city =>
      `${city.name} ${city.country}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  return (
    <div className="page">

      <span className="eyebrow">
        DISCOVER
      </span>

      <h1>
        Explore the world
      </h1>

      <input
        placeholder="Search destination..."
        value={search}
        onChange={e =>
          setSearch(e.target.value)
        }
      />

      <h2>Destinations</h2>

      <div className="grid">

        {filtered.map(city => (

          <div className="card" key={city.id}>

            <div className="card-image">
              {city.name.charAt(0)}
            </div>

            <h3>
              {city.name}
            </h3>

            <p>
              {city.country}
            </p>

            <p>
              Cost index:
              {' '}
              {city.cost_index}
            </p>

            <p>
              Popularity:
              {' '}
              {city.popularity}
            </p>

          </div>

        ))}

      </div>

      <h2>
        Experiences
      </h2>

      <div className="grid">

        {activities.map(activity => (

          <div
            className="card"
            key={activity.id}
          >

            <h3>
              {activity.name}
            </h3>

            <p>
              {activity.description}
            </p>

            <strong>
              ₹
              {Number(
                activity.estimated_cost
              ).toLocaleString('en-IN')}
            </strong>

          </div>

        ))}

      </div>

    </div>
  )
}