import { useState } from "react";
import { supabase } from "../../lib/supabase";

const categories = [
  "Transport",
  "Stay",
  "Food",
  "Activities",
  "Shopping",
  "Other",
];

export default function AddExpense({ tripId, stopId = null, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    category: "Food",
    amount: "",
    expense_date: "",
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

  const addExpense = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Enter an expense name.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("You must be logged in.");

      const { data, error } = await supabase
        .from("trip_expenses")
        .insert({
          trip_id: tripId,
          stop_id: stopId,
          user_id: user.id,
          title: form.title.trim(),
          category: form.category,
          amount: Number(form.amount),
          expense_date: form.expense_date || null,
          notes: form.notes.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setForm({
        title: "",
        category: "Food",
        amount: "",
        expense_date: "",
        notes: "",
      });

      onAdded?.(data);
    } catch (err) {
      setError(err.message || "Unable to add expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="trip-form compact" onSubmit={addExpense}>
      <h3>💰 Add expense</h3>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>Expense</label>
        <input
          name="title"
          value={form.title}
          onChange={change}
          placeholder="Hotel booking"
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
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={change}
            min="1"
            step="1"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="expense_date"
          value={form.expense_date}
          onChange={change}
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={change}
          rows={2}
        />
      </div>

      <button className="primary-button" disabled={loading}>
        {loading ? "Saving..." : "+ Add Expense"}
      </button>
    </form>
  );
}