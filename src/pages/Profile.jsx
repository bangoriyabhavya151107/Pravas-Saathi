import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'

export default function Profile() {

  const { user } = useAuth()

  const [name, setName] =
    useState('')

  const [message, setMessage] =
    useState('')

  useEffect(() => {

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {

        if (data) {
          setName(
            data.full_name || ''
          )
        }

      })

  }, [user.id])

  async function save(e) {

    e.preventDefault()

    const { error } =
      await supabase
        .from('profiles')
        .update({
          full_name: name,
          updated_at:
            new Date().toISOString()
        })
        .eq('id', user.id)

    setMessage(
      error
        ? error.message
        : 'Profile saved ✓'
    )
  }

  return (

    <div className="page">

      <h1>
        Profile
      </h1>

      <p>
        {user.email}
      </p>

      <form
        className="auth-panel"
        onSubmit={save}
      >

        <label>
          Full name
        </label>

        <input
          value={name}
          onChange={e =>
            setName(e.target.value)
          }
        />

        <button className="primary-btn">
          Save
        </button>

        {message && (
          <p>{message}</p>
        )}

      </form>

    </div>

  )
}