const FILTER_TITLES = {
  all: "Overall Totals",
  daily: "Daily Totals",
  weekly: "Weekly Totals",
  monthly: "Monthly Totals",
};

export default function CategoryTotals({ summary, filterMode = "daily" }) {
  const title = FILTER_TITLES[filterMode] || "Totals";

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      {summary.totals.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No totals for selected period.</p>
      ) : (
        <ul className="mt-3 divide-y">
          {summary.totals.map((item) => (
            <li key={item.category} className="flex items-center justify-between py-2 text-sm">
              <span className="text-slate-700">{item.category}</span>
              <span className="font-medium text-slate-900">₹{Number(item.total).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between border-t pt-3 font-semibold">
        <span>Grand Total</span>
        <span>₹{Number(summary.grand_total || 0).toFixed(2)}</span>
      </div>
    </div>
  );
}
