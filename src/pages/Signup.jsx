import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()

  const [fullName, setFullName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  async function handleSignup(event) {
    event.preventDefault()

    setError('')
    setMessage('')
    setLoading(true)

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name:
            fullName.trim(),
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      navigate('/dashboard')
    } else {
      setMessage(
        'Account created. Please check your email to confirm your account.'
      )
    }

    setLoading(false)
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
            BEGIN YOUR JOURNEY
          </span>

          <h1>
            Your next
            <br />
            story starts here.
          </h1>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-box">
          <span className="eyebrow">
            CREATE ACCOUNT
          </span>

          <h2>
            Welcome to
            <br />
            Pravas Saathi.
          </h2>

          <p className="auth-description">
            Create your travel profile and start
            planning meaningful journeys.
          </p>

          <form onSubmit={handleSignup}>
            <label>
              Full name

              <input
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value
                  )
                }
                placeholder="Your name"
                required
              />
            </label>

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
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </label>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {message && (
              <div className="form-success">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="form-button"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Create account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?

            <Link to="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}