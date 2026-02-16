import { useEffect, useState } from "react";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Other"];

const initialForm = (selectedDate) => ({
  date: selectedDate,
  category: CATEGORIES[0],
  amount: "",
  note: "",
});

export default function ExpenseForm({ selectedDate, onSubmit, loading }) {
  const [form, setForm] = useState(initialForm(selectedDate));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm((prev) => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  const validate = () => {
    const nextErrors = {};
    if (!form.date) nextErrors.date = "Date is required";
    if (!form.category) nextErrors.category = "Category is required";
    if (!form.amount || Number(form.amount) <= 0) nextErrors.amount = "Amount must be greater than 0";
    if (form.note.length > 100) nextErrors.note = "Note must be 100 characters or less";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      date: form.date,
      category: form.category,
      amount: Number(form.amount).toFixed(2),
      note: form.note.trim(),
    });

    setForm(initialForm(selectedDate));
    setErrors({});
  };

  return (
    <form className="space-y-4 rounded-lg border bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold">Add Expense</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2"
          required
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2"
          required
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="amount">Amount</label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="0.00"
          required
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="note">Note (optional)</label>
        <input
          id="note"
          name="note"
          type="text"
          maxLength={100}
          value={form.note}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="Short note"
        />
        {errors.note && <p className="mt-1 text-sm text-red-600">{errors.note}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
}
