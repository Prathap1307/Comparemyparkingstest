import { getDashboardMetrics } from "@/lib/dashboard";
import { Suspense } from "react";

async function Metrics() {
  const metrics = await getDashboardMetrics();
  const cards = [
    { label: "Arrivals today", value: metrics.arrivalsToday },
    { label: "Returns today", value: metrics.returnsToday },
    { label: "Occupancy", value: `${metrics.occupancy}%` },
    { label: "Revenue (7d)", value: `£${metrics.revenue7d}` },
    { label: "Unpaid", value: `£${metrics.unpaid}` },
    { label: "Cancellations", value: metrics.cancellations },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="card p-4">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading metrics...</div>}>
        <Metrics />
      </Suspense>
      <section className="card p-6">
        <h2 className="text-lg font-semibold">Live operations</h2>
        <p className="text-sm text-slate-600">Use quick actions to confirm arrivals and push vouchers.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Confirm arrivals", "Mark paid", "Print vouchers"].map((action) => (
            <button
              key={action}
              className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              type="button"
            >
              {action}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
