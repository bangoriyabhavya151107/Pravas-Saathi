import { useState } from "react";
import { supabase } from "../../lib/supabase";

const categories = [
  "Sightseeing",
  "Food",
  "Adventure",
  "Culture",
  "Shopping",
  "Relaxation",
  "Other",
];

export default function AddActivity({ stopId, onAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "Sightseeing",
    activity_date: "",
    start_time: "",
    duration_minutes: "",
    cost: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addActivity = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Enter an activity name.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("trip_activities")
        .insert({
          stop_id: stopId,
          name: form.name.trim(),
          category: form.category,
          activity_date: form.activity_date || null,
          start_time: form.start_time || null,
          duration_minutes: form.duration_minutes
            ? Number(form.duration_minutes)
            : null,
          cost: form.cost ? Number(form.cost) : 0,
          description: form.description.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setForm({
        name: "",
        category: "Sightseeing",
        activity_date: "",
        start_time: "",
        duration_minutes: "",
        cost: "",
        description: "",
      });

      onAdded?.(data);
    } catch (err) {
      setError(err.message || "Unable to add activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="trip-form compact" onSubmit={addActivity}>
      <h3>✨ Add activity</h3>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>Activity</label>
        <input
          name="name"
          value={form.name}
          onChange={change}
          placeholder="Visit Sabarmati Ashram"
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={change}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Estimated cost</label>
          <input
            type="number"
            name="cost"
            value={form.cost}
            onChange={change}
            min="0"
            placeholder="₹ 500"
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="activity_date"
            value={form.activity_date}
            onChange={change}
          />
        </div>

        <div className="form-group">
          <label>Start time</label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={change}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Duration (minutes)</label>
        <input
          type="number"
          name="duration_minutes"
          value={form.duration_minutes}
          onChange={change}
          min="1"
          placeholder="120"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={change}
          rows={3}
          placeholder="What do you want to do here?"
        />
      </div>

      <button className="primary-button" disabled={loading}>
        {loading ? "Adding..." : "+ Add Activity"}
      </button>
    </form>
  );
}