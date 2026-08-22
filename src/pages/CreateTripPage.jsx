import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CreateTrip from '../components/trips/CreateTrip'

export default function CreateTripPage() {
  const navigate = useNavigate()

  function handleCreated(trip) {
    if (!trip?.id) return

    navigate(`/trips/${trip.id}`)
  }

  return (
    <>
      <Navbar authenticated />

      <main className="trip-create-page">

        <div className="trip-create-wrapper">

          <div className="trip-create-back">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate('/dashboard')}
            >
              ← Back to dashboard
            </button>
          </div>

          <div className="trip-create-content">
            <CreateTrip onCreated={handleCreated} />
          </div>

        </div>

      </main>
    </>
  )
}