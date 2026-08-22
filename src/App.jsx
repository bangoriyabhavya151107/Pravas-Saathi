import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { supabase } from './lib/supabase'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Expenses from './pages/Expenses'
import Profile from './pages/Profile'

import ProtectedRoute from './components/ProtectedRoute'
import LoadingScreen from './components/LoadingScreen'

import './styles/landing.css'
import './styles/auth.css'
import './styles/dashboard.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (mounted) {
        setSession(session)
        setLoading(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={
          session
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      <Route
        path="/signup"
        element={
          session
            ? <Navigate to="/dashboard" replace />
            : <Signup />
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute session={session}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute session={session}>
            <Explore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses"
        element={
          <ProtectedRoute session={session}>
            <Expenses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute session={session}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default App