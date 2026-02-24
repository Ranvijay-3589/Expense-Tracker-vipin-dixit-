import { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Other"];

export default function ExpenseList({ expenses, onDelete, onEdit, deletingId, showDate = false }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", category: "", customCategory: "", amount: "", note: "" });
  const [saving, setSaving] = useState(false);

  const startEdit = (expense) => {
    const isPreset = CATEGORIES.includes(expense.category);
    setEditingId(expense.id);
    setEditForm({
      date: expense.date,
      category: isPreset ? expense.category : "Other",
      customCategory: isPreset ? "" : expense.category,
      amount: Number(expense.amount),
      note: expense.note || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ date: "", category: "", customCategory: "", amount: "", note: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    if (!editForm.date || !editForm.category || !editForm.amount || Number(editForm.amount) <= 0) return;
    if (editForm.category === "Other" && !editForm.customCategory.trim()) return;

    const finalCategory = editForm.category === "Other" ? editForm.customCategory.trim() : editForm.category;

    setSaving(true);
    try {
      await onEdit(id, {
        date: editForm.date,
        category: finalCategory,
        amount: Number(editForm.amount).toFixed(2),
        note: editForm.note.trim(),
      });
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Expenses
          <span className="ml-2 text-sm font-normal text-slate-500">({expenses.length} entries)</span>
        </h2>
        {expenses.length > 0 && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
            Total: ₹{total.toFixed(2)}
          </span>
        )}
      </div>

      {expenses.length === 0 ? (
        <p className="p-4 text-sm text-slate-500">No expenses found for the selected period.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">#</th>
                {showDate && <th className="px-4 py-3">Date</th>}
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Amount (₹)</th>
                <th className="px-4 py-3">Note</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.map((expense, index) => (
                <tr key={expense.id} className="hover:bg-slate-50">
                  {editingId === expense.id ? (
                    <td colSpan={showDate ? 6 : 5} className="px-4 py-3">
                      <div className="space-y-2 rounded-md bg-slate-50 p-3">
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                        {editForm.category === "Other" && (
                          <div>
                            <label className="block text-xs font-medium text-slate-600">
                              Custom Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="customCategory"
                              maxLength={50}
                              value={editForm.customCategory}
                              onChange={handleEditChange}
                              className="mt-1 w-full rounded border px-2 py-1 text-sm"
                              placeholder="Enter custom category name"
                              required
                            />
                          </div>
                        )}
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
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                      {showDate && (
                        <td className="px-4 py-3 whitespace-nowrap text-slate-700">{expense.date}</td>
                      )}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        ₹{Number(expense.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{expense.note || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(expense)}
                            className="rounded border border-blue-300 px-2.5 py-1 text-xs text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(expense.id)}
                            disabled={deletingId === expense.id}
                            className="rounded border border-red-300 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
                          >
                            {deletingId === expense.id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 bg-slate-50 font-semibold">
                <td colSpan={showDate ? 3 : 2} className="px-4 py-3 text-slate-700">Total</td>
                <td className="px-4 py-3 text-right text-indigo-700">₹{total.toFixed(2)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
