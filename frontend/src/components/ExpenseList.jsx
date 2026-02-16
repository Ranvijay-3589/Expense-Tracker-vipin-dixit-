export default function ExpenseList({ expenses, onDelete, deletingId }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No expenses for selected date.</p>
      ) : (
        <ul className="mt-3 divide-y">
          {expenses.map((expense) => (
            <li key={expense.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-800">{expense.category} - ${Number(expense.amount).toFixed(2)}</p>
                <p className="text-sm text-slate-600">{expense.note || "No note"}</p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(expense.id)}
                disabled={deletingId === expense.id}
                className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {deletingId === expense.id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
