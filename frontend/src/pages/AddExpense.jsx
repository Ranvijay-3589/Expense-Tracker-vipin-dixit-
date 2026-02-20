import { useCallback, useEffect, useState } from "react";

import CategoryTotals from "../components/CategoryTotals";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { createExpense, deleteExpense, getExpensesByDate, getSummaryByDate } from "../services/api";

const todayISO = new Date().toISOString().slice(0, 10);

export default function AddExpensePage() {
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totals: [], grand_total: 0 });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setError("");
      const [expenseData, summaryData] = await Promise.all([
        getExpensesByDate(selectedDate),
        getSummaryByDate(selectedDate),
      ]);
      setExpenses(expenseData);
      setSummary(summaryData);
    } catch {
      setError("Unable to load expenses. Ensure backend is running.");
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (payload) => {
    setLoading(true);
    try {
      await createExpense(payload);
      if (payload.date !== selectedDate) {
        setSelectedDate(payload.date);
      } else {
        await fetchData();
      }
    } catch {
      setError("Unable to add expense.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteExpense(id);
      await fetchData();
    } catch {
      setError("Unable to delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Expense Tracker</h1>
        <p className="text-sm text-slate-600">Add and view daily expenses by date.</p>
      </header>

      <section className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <label className="block text-sm font-medium text-slate-700" htmlFor="selectedDate">
          View Date
        </label>
        <input
          id="selectedDate"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="mt-1 w-full max-w-xs rounded-md border px-3 py-2"
        />
      </section>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseForm selectedDate={selectedDate} onSubmit={handleCreate} loading={loading} />
        <CategoryTotals summary={summary} />
      </div>

      <section className="mt-6">
        <ExpenseList expenses={expenses} onDelete={handleDelete} deletingId={deletingId} />
      </section>
    </main>
  );
}
