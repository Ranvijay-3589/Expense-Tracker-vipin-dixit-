import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CategoryTotals from "../components/CategoryTotals";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { useAuth } from "../context/AuthContext";
import {
  createExpense,
  deleteExpense,
  updateExpense,
  getExpensesByDate,
  getExpensesByRange,
  getAllExpenses,
  getSummaryByDate,
  getSummaryByRange,
  getAllSummary,
} from "../services/api";

const todayISO = new Date().toISOString().slice(0, 10);

function getWeekRange(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
  };
}

function getMonthRange(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return {
    start: first.toISOString().slice(0, 10),
    end: last.toISOString().slice(0, 10),
  };
}

function formatRangeLabel(filterMode, selectedDate) {
  if (filterMode === "all") return "All Time";
  if (filterMode === "daily") return selectedDate;
  if (filterMode === "weekly") {
    const { start, end } = getWeekRange(selectedDate);
    return `${start} to ${end}`;
  }
  if (filterMode === "monthly") {
    const d = new Date(selectedDate + "T00:00:00");
    return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }
  return "";
}

const FILTER_MODES = [
  { key: "all", label: "All" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

export default function AddExpensePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState("all");
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totals: [], grand_total: 0 });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setError("");
      let expensePromise;
      let summaryPromise;

      if (filterMode === "all") {
        expensePromise = getAllExpenses();
        summaryPromise = getAllSummary();
      } else if (filterMode === "daily") {
        expensePromise = getExpensesByDate(selectedDate);
        summaryPromise = getSummaryByDate(selectedDate);
      } else if (filterMode === "weekly") {
        const { start, end } = getWeekRange(selectedDate);
        expensePromise = getExpensesByRange(start, end);
        summaryPromise = getSummaryByRange(start, end);
      } else if (filterMode === "monthly") {
        const { start, end } = getMonthRange(selectedDate);
        expensePromise = getExpensesByRange(start, end);
        summaryPromise = getSummaryByRange(start, end);
      }

      const [expenseData, summaryData] = await Promise.all([expensePromise, summaryPromise]);
      setExpenses(expenseData);
      setSummary(summaryData);
    } catch {
      setError("Unable to load expenses. Ensure backend is running.");
    }
  }, [filterMode, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (payload) => {
    setLoading(true);
    try {
      await createExpense(payload);
      if (filterMode === "daily" && payload.date !== selectedDate) {
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

  const handleEdit = async (id, payload) => {
    try {
      setError("");
      await updateExpense(id, payload);
      await fetchData();
    } catch {
      setError("Unable to update expense.");
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

  const rangeLabel = formatRangeLabel(filterMode, selectedDate);
  const showDatePicker = filterMode !== "all";

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expense Tracker</h1>
          <p className="text-sm text-slate-600">
            Welcome, <span className="font-medium">{user?.username}</span> &mdash; Add and view expenses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { logout(); navigate("/login"); }}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Logout
        </button>
      </header>

      {/* Filter Controls */}
      <section className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Filter By</label>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden">
              {FILTER_MODES.map((mode) => (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => setFilterMode(mode.key)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    filterMode === mode.key
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                  } ${mode.key !== "all" ? "border-l border-slate-300" : ""}`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {showDatePicker && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="selectedDate">
                {filterMode === "daily" ? "Select Date" : filterMode === "weekly" ? "Select Week" : "Select Month"}
              </label>
              <input
                id="selectedDate"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          )}

          <div className="flex items-center">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {filterMode === "all" ? "Showing all expenses" : `Period: ${rangeLabel}`}
            </span>
          </div>
        </div>
      </section>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseForm selectedDate={selectedDate} onSubmit={handleCreate} loading={loading} />
        <CategoryTotals summary={summary} filterMode={filterMode} />
      </div>

      <section className="mt-6">
        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          onEdit={handleEdit}
          deletingId={deletingId}
          showDate={filterMode !== "daily"}
        />
      </section>
    </main>
  );
}
