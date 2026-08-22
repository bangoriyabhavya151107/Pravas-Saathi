import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()

    setError('')
    setMessage('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    setLoading(true)

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo:
            window.location.origin
        }
      })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.session) {
      navigate('/')
    } else {
      setMessage(
        'Account created. Check your email to confirm your account.'
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">

        <div className="brand">
          <span className="brand-icon">P</span>
          Pravāsathi
        </div>

        <h1>Begin your journey.</h1>

        <p>
          Create your personal travel space.
        </p>

        <form onSubmit={handleSignup}>

          <label>Full name</label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

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
            minLength={8}
            required
          />

          <label>Confirm password</label>

          <input
            type="password"
            value={confirm}
            onChange={(e) =>
              setConfirm(e.target.value)
            }
            required
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {message && (
            <div className="success">
              {message}
            </div>
          )}

          <button className="primary-btn">
            {loading
              ? 'Creating account...'
              : 'Create account'}
          </button>

        </form>

        <p>
          Already have an account?
          {' '}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}