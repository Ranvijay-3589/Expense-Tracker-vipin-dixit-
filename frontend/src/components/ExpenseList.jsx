import { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Other"];

export default function ExpenseList({ expenses, onDelete, onEdit, deletingId }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", category: "", amount: "", note: "" });
  const [saving, setSaving] = useState(false);

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      date: expense.date,
      category: expense.category,
      amount: Number(expense.amount),
      note: expense.note || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ date: "", category: "", amount: "", note: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    if (!editForm.date || !editForm.category || !editForm.amount || Number(editForm.amount) <= 0) return;
    setSaving(true);
    try {
      await onEdit(id, {
        date: editForm.date,
        category: editForm.category,
        amount: Number(editForm.amount).toFixed(2),
        note: editForm.note.trim(),
      });
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No expenses for selected date.</p>
      ) : (
        <ul className="mt-3 divide-y">
          {expenses.map((expense) => (
            <li key={expense.id} className="py-3">
              {editingId === expense.id ? (
                <div className="space-y-2 rounded-md bg-slate-50 p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditChange}
                        className="mt-1 w-full rounded border px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Category</label>
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="mt-1 w-full rounded border px-2 py-1 text-sm"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Amount (₹)</label>
                      <input
                        type="number"
                        name="amount"
                        min="0.01"
                        step="0.01"
                        value={editForm.amount}
                        onChange={handleEditChange}
                        className="mt-1 w-full rounded border px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Note</label>
                      <input
                        type="text"
                        name="note"
                        maxLength={100}
                        value={editForm.note}
                        onChange={handleEditChange}
                        className="mt-1 w-full rounded border px-2 py-1 text-sm"
                        placeholder="Short note"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSave(expense.id)}
                      disabled={saving}
                      className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">
                      {expense.category} &mdash; ₹{Number(expense.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600">{expense.note || "No note"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(expense)}
                      className="rounded-md border border-blue-300 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(expense.id)}
                      disabled={deletingId === expense.id}
                      className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingId === expense.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
