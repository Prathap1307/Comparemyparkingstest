import { getDashboardMetrics } from "@/lib/dashboard";
import { CalendarClock, Car, CreditCard, Fuel, HandCoins, Users } from "lucide-react";
import { Suspense } from "react";

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof CalendarClock }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

async function Metrics() {
  const metrics = await getDashboardMetrics();
  const cards = [
    { label: "Arrivals today", value: metrics.arrivalsToday, icon: CalendarClock },
    { label: "Returns today", value: metrics.returnsToday, icon: HandCoins },
    { label: "Occupancy", value: `${metrics.occupancy}%`, icon: Car },
    { label: "Revenue (7d)", value: `£${metrics.revenue7d}`, icon: CreditCard },
    { label: "Unpaid", value: `£${metrics.unpaid}`, icon: Fuel },
    { label: "Cancellations", value: metrics.cancellations, icon: Users },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-emerald-700">Live operations</p>
        <h1 className="text-3xl font-semibold text-slate-900">Control centre</h1>
        <p className="text-slate-600">
          Monitor arrivals, returns, and revenue with real-time signal from booking and flight data.
        </p>
      </div>

      <Suspense fallback={<div className="card p-6">Loading metrics...</div>}>
        <Metrics />
      </Suspense>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Today</p>
              <h2 className="text-lg font-semibold text-slate-900">Arrivals & returns</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["Verify meet & greet instructions", "Confirm terminal surcharges", "Escalate delays"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
              >
                <span>{item}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">Actionable</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Quick actions</h3>
          <p className="mt-1 text-sm text-slate-600">Fast paths for the ops team.</p>
          <div className="mt-4 space-y-2">
            {["Check-in queue", "Print vouchers", "Mark as paid", "Escalate delays"].map((action) => (
              <button
                key={action}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                type="button"
              >
                {action}
                <span className="text-xs text-emerald-700">Go</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
