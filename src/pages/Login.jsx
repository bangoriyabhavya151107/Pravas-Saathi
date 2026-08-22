import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()

    setError('')
    setLoading(true)

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/')
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="brand">
          <span className="brand-icon">P</span>
          Pravāsathi
        </div>

        <h1>Welcome back.</h1>

        <p>
          Your next journey is waiting.
        </p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button className="primary-btn">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p>
          New traveller?
          {' '}
          <Link to="/signup">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}