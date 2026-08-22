import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AddStop({ tripId, onAdded }) {
  const [form, setForm] = useState({
    city: "",
    country: "India",
    arrival_date: "",
    departure_date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addStop = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.city.trim()) {
      setError("Enter a city.");
      return;
    }

    if (form.departure_date < form.arrival_date) {
      setError("Departure cannot be before arrival.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("trip_stops")
        .insert({
          trip_id: tripId,
          city: form.city.trim(),
          country: form.country.trim(),
          arrival_date: form.arrival_date || null,
          departure_date: form.departure_date || null,
          notes: form.notes.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setForm({
        city: "",
        country: "India",
        arrival_date: "",
        departure_date: "",
        notes: "",
      });

      onAdded?.(data);
    } catch (err) {
      setError(err.message || "Unable to add stop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="trip-form compact" onSubmit={addStop}>
      <h3>📍 Add a stop</h3>

      {error && <div className="form-error">{error}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label>City</label>
          <input
            name="city"
            value={form.city}
            onChange={change}
            placeholder="Ahmedabad"
            required
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            name="country"
            value={form.country}
            onChange={change}
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Arrival</label>
          <input
            type="date"
            name="arrival_date"
            value={form.arrival_date}
            onChange={change}
          />
        </div>

        <div className="form-group">
          <label>Departure</label>
          <input
            type="date"
            name="departure_date"
            value={form.departure_date}
            onChange={change}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={change}
          placeholder="Places I want to explore..."
          rows={3}
        />
      </div>

      <button className="primary-button" disabled={loading}>
        {loading ? "Adding..." : "+ Add Stop"}
      </button>
    </form>
  );
}