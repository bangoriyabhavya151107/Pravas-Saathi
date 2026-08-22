import {
  NavLink,
  Outlet,
  useNavigate
} from 'react-router-dom'

import { supabase } from '../lib/supabase'

export default function AppLayout() {

  const navigate = useNavigate()

  async function logout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">
          <span className="brand-icon">P</span>
          Pravāsathi
        </div>

        <nav>

          <NavLink to="/">
            🏠 Dashboard
          </NavLink>

          <NavLink to="/trips">
            🧳 My Trips
          </NavLink>

          <NavLink to="/explore">
            🌍 Explore
          </NavLink>

          <NavLink to="/calendar">
            📅 Calendar
          </NavLink>

          <NavLink to="/profile">
            👤 Profile
          </NavLink>

        </nav>

        <button
          className="logout"
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      <main className="content">

        <header className="topbar">
          <span>Pravāsathi</span>
        </header>

        <Outlet />

      </main>

    </div>
  )
}