import { useEffect, useMemo, useState } from 'react'

import Navbar from '../components/Navbar'

import { supabase } from '../lib/supabase'

export default function Expenses() {
  const [expenses, setExpenses] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [form, setForm] =
    useState({
      description: '',
      amount: '',
      category: 'other',
    })

  const [message, setMessage] =
    useState('')

  useEffect(() => {
    loadExpenses()
  }, [])

  async function loadExpenses() {
    setLoading(true)

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const {
      data,
      error,
    } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order(
        'created_at',
        { ascending: false }
      )

    if (error) {
      console.error(error)
    }

    setExpenses(data || [])
    setLoading(false)
  }

  async function addExpense(event) {
    event.preventDefault()

    setMessage('')

    const amount =
      Number(form.amount)

    if (
      !form.description.trim() ||
      !amount ||
      amount <= 0
    ) {
      setMessage(
        'Enter a valid description and amount.'
      )

      return
    }

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage(
        'Your session has expired.'
      )

      return
    }

    const {
      error,
    } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        description:
          form.description.trim(),
        amount,
        category:
          form.category,
      })

    if (error) {
      console.error(error)

      setMessage(
        error.message
      )

      return
    }

    setForm({
      description: '',
      amount: '',
      category: 'other',
    })

    setMessage(
      'Expense added successfully.'
    )

    loadExpenses()
  }

  const total = useMemo(
    () =>
      expenses.reduce(
        (sum, expense) =>
          sum + Number(expense.amount || 0),
        0
      ),
    [expenses]
  )

  return (
    <>
      <Navbar authenticated />

      <main className="dashboard-page">
        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">
              YOUR MONEY
            </span>

            <h1>
              Travel
              <br />
              expenses.
            </h1>

            <p>
              Keep your journey beautiful
              and your budget visible.
            </p>
          </div>

          <div className="expense-total">
            <span>
              TOTAL SPENDING
            </span>

            <strong>
              ₹{total.toLocaleString('en-IN')}
            </strong>
          </div>
        </section>

        <section className="expense-layout">
          <div className="dashboard-card">
            <span className="eyebrow">
              ADD EXPENSE
            </span>

            <h2>
              Record a purchase.
            </h2>

            <form
              className="expense-form"
              onSubmit={addExpense}
            >
              <label>
                Description

                <input
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description:
                        event.target.value,
                    })
                  }
                  placeholder="Train ticket"
                  required
                />
              </label>

              <label>
                Amount

                <input
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      amount:
                        event.target.value,
                    })
                  }
                  placeholder="1200"
                  required
                />
              </label>

              <label>
                Category

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category:
                        event.target.value,
                    })
                  }
                >
                  <option value="transport">
                    Transport
                  </option>

                  <option value="stay">
                    Stay
                  </option>

                  <option value="food">
                    Food
                  </option>

                  <option value="activities">
                    Activities
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </label>

              <button
                type="submit"
                className="dashboard-primary-button"
              >
                Add expense →
              </button>

              {message && (
                <p className="inline-message">
                  {message}
                </p>
              )}
            </form>
          </div>

          <div className="dashboard-card">
            <span className="eyebrow">
              HISTORY
            </span>

            <h2>
              Recent expenses.
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : expenses.length === 0 ? (
              <div className="empty-mini">
                No expenses recorded yet.
              </div>
            ) : (
              <div className="expense-list">
                {expenses.map(
                  (expense) => (
                    <div
                      className="expense-row"
                      key={expense.id}
                    >
                      <div>
                        <strong>
                          {expense.description}
                        </strong>

                        <span>
                          {expense.category}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {Number(
                          expense.amount
                        ).toLocaleString(
                          'en-IN'
                        )}
                      </strong>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}