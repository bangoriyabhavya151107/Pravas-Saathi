import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CreateTrip({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createTrip = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter a trip name.");
      return;
    }

    if (!form.start_date || !form.end_date) {
      setError("Please select your travel dates.");
      return;
    }

    if (form.end_date < form.start_date) {
      setError("End date cannot be before start date.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in.");
      }

      const { data, error } = await supabase
        .from("trips")
        .insert({
          user_id: user.id,
          name: form.name.trim(),
          description: form.description.trim(),
          start_date: form.start_date,
          end_date: form.end_date,
          budget: form.budget ? Number(form.budget) : 0,
        })
        .select()
        .single();

      if (error) throw error;

      setForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        budget: "",
      });

      onCreated?.(data);
    } catch (err) {
      setError(err.message || "Unable to create trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="trip-form" onSubmit={createTrip}>
      <div className="form-header">
        <span className="form-eyebrow">NEW JOURNEY</span>
        <h2>Create your trip</h2>
        <p>Give your journey a name and set the basic details.</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>Trip name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Gujarat Heritage Journey"
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What is this journey about?"
          maxLength={500}
          rows={4}
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Start date</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End date</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Estimated budget</label>
        <input
          type="number"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          placeholder="₹ 25,000"
          min="0"
          step="1"
        />
      </div>

      <button className="primary-button" disabled={loading}>
        {loading ? "Creating..." : "Create Trip →"}
      </button>
    </form>
  );
}