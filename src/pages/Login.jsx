import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  async function handleLogin(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    const {
      error,
    } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Link
          to="/"
          className="auth-brand"
        >
          Pravas Saathi<span>.</span>
        </Link>

        <div>
          <span className="eyebrow">
            WELCOME BACK
          </span>

          <h1>
            Continue
            <br />
            your journey.
          </h1>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-box">
          <span className="eyebrow">
            SIGN IN
          </span>

          <h2>
            Welcome back.
          </h2>

          <p className="auth-description">
            Your journeys are waiting for you.
          </p>

          <form onSubmit={handleLogin}>
            <label>
              Email

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Your password"
                required
              />
            </label>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="form-button"
              disabled={loading}
            >
              {loading
                ? 'Signing in...'
                : 'Sign in →'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?

            <Link to="/signup">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}