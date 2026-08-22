import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Navbar({
  authenticated = false,
}) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="app-navbar">
      <Link
        to={authenticated ? '/dashboard' : '/'}
        className="app-brand"
      >
        Pravas Saathi<span>.</span>
      </Link>

      {authenticated ? (
        <nav className="app-nav-links">
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/explore">
            Explore
          </Link>

          <Link to="/expenses">
            Expenses
          </Link>

          <Link to="/profile">
            Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      ) : (
        <nav className="app-nav-links">
          <Link to="/login">
            Login
          </Link>

          <Link
            to="/signup"
            className="nav-primary"
          >
            Start planning
          </Link>
        </nav>
      )}
    </header>
  )
}