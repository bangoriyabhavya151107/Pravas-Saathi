import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        navigate('/login')
        return
      }

      setUser(user)

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, language, timezone')
        .eq('id', user.id)
        .single()

      if (!error) {
        setProfile(data)
      }
    }

    loadDashboard()
  }, [navigate])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <main>
      <header>
        <h1>Pravāsathi</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section>
        <h2>
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''} 👋
        </h2>

        <p>
          Your next journey starts here.
        </p>

        <button>
          + Plan New Trip
        </button>
      </section>

      <nav>
        <a href="/dashboard">Home</a>
        <a href="#">My Trips</a>
        <a href="#">Explore</a>
        <a href="#">Calendar</a>
        <a href="#">Profile</a>
      </nav>

      {user && (
        <small>
          Signed in as {user.email}
        </small>
      )}
    </main>
  )
}