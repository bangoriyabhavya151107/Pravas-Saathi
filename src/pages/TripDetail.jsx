import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function TripDetail() {

  const { id } = useParams()

  const [trip, setTrip] = useState(null)
  const [cities, setCities] = useState([])
  const [stops, setStops] = useState([])
  const [selectedCity, setSelectedCity] =
    useState('')

  async function load() {

    const tripResult =
      await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single()

    const cityResult =
      await supabase
        .from('cities')
        .select('*')
        .order('name')

    const stopResult =
      await supabase
        .from('trip_stops')
        .select(`
          *,
          cities (
            name,
            country
          )
        `)
        .eq('trip_id', id)
        .order('order_index')

    setTrip(tripResult.data)
    setCities(cityResult.data || [])
    setStops(stopResult.data || [])
  }

  useEffect(() => {
    load()
  }, [id])

  async function addCity() {

    if (!selectedCity) return

    await supabase
      .from('trip_stops')
      .insert({
        trip_id: id,
        city_id: selectedCity,
        arrival_date: trip.start_date,
        departure_date: trip.end_date,
        order_index: stops.length
      })

    setSelectedCity('')
    load()
  }

  async function removeCity(stopId) {

    await supabase
      .from('trip_stops')
      .delete()
      .eq('id', stopId)

    load()
  }

  if (!trip) {
    return <div className="page">
      Loading...
    </div>
  }

  return (
    <div className="page">

      <Link to="/trips">
        ← My Trips
      </Link>

      <h1>{trip.title}</h1>

      <p>
        {trip.start_date}
        {' → '}
        {trip.end_date}
      </p>

      <section className="auth-panel">

        <h2>Stops</h2>

        <select
          value={selectedCity}
          onChange={e =>
            setSelectedCity(e.target.value)
          }
        >

          <option value="">
            Select a city
          </option>

          {cities.map(city => (

            <option
              key={city.id}
              value={city.id}
            >
              {city.name}, {city.country}
            </option>

          ))}

        </select>

        <button
          className="primary-btn"
          onClick={addCity}
        >
          + Add Stop
        </button>

        {stops.map((stop, index) => (

          <div
            key={stop.id}
            style={{
              padding: 15,
              borderBottom:
                '1px solid #ddd'
            }}
          >

            <strong>
              {index + 1}.{' '}
              {stop.cities.name}
            </strong>

            <button
              onClick={() =>
                removeCity(stop.id)
              }
            >
              Remove
            </button>

          </div>

        ))}

      </section>

      <br />

      <Link
        className="primary-btn"
        to={`/trips/${id}/itinerary`}
      >
        Open Itinerary →
      </Link>

    </div>
  )
}