import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import ProtectedRoute
  from './components/ProtectedRoute'

import AppLayout
  from './components/AppLayout'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Trips from './pages/Trips'
import CreateTrip from './pages/CreateTrip'
import TripDetail from './pages/TripDetail'
import Itinerary from './pages/Itinerary'
import Explore from './pages/Explore'
import Calendar from './pages/Calendar'
import Profile from './pages/Profile'
import SharedTrip from './pages/SharedTrip'

export default function App() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/share/:id"
        element={<SharedTrip />}
      />

      <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/trips"
            element={<Trips />}
          />

          <Route
            path="/trips/new"
            element={<CreateTrip />}
          />

          <Route
            path="/trips/:id"
            element={<TripDetail />}
          />

          <Route
            path="/trips/:id/itinerary"
            element={<Itinerary />}
          />

          <Route
            path="/explore"
            element={<Explore />}
          />

          <Route
            path="/calendar"
            element={<Calendar />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Route>

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>
  )
}