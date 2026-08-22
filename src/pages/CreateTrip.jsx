import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'

export default function CreateTrip() {

  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    is_public: false
  })

  const [error, setError] = useState('')

  function update(e) {

    setForm({
      ...form,
      [e.target.name]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.value
    })
  }

  async function submit(e) {

    e.preventDefault()

    setError('')

    if (
      form.end_date < form.start_date
    ) {
      setError(
        'End date must be after start date.'
      )

      return
    }

    const { data, error } =
      await supabase
        .from('trips')
        .insert({
          ...form,
          user_id: user.id
        })
        .select()
        .single()

    if (error) {
      setError(error.message)
      return
    }

    navigate(`/trips/${data.id}`)
  }

  return (
    <div className="page">

      <Link to="/trips">
        ← My Trips
      </Link>

      <h1>Create your journey</h1>

      <form
        onSubmit={submit}
        className="auth-panel"
      >

        <label>Trip name</label>

        <input
          name="title"
          value={form.title}
          onChange={update}
          placeholder="Rajasthan Explorer"
          required
        />

        <label>Start date</label>

        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={update}
          required
        />

        <label>End date</label>

        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={update}
          required
        />

        <label>Description</label>

        <textarea
          name="description"
          value={form.description}
          onChange={update}
        />

        <label>
          <input
            type="checkbox"
            name="is_public"
            checked={form.is_public}
            onChange={update}
          />

          {' '}Make this trip public
        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button className="primary-btn">
          Create Trip
        </button>

      </form>

    </div>
  )
}