import Link from "next/link";
import { ParkingSearchForm } from "@/components/parking-search-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CompareMyPrking.co.uk | Airport Parking",
  description: "Secure meet & greet and shuttle parking with fast booking.",
};

export default function PublicHome() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <section className="card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-600">CompareMyPrking.co.uk</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Airport parking made reliable.
            </h1>
            <p className="mt-2 text-slate-600">
              Meet & greet, valet and shuttle options at Heathrow, Gatwick and beyond. Live capacity and transparent pricing.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/book" className="rounded-lg bg-brand-600 px-4 py-2 text-white shadow hover:bg-brand-700">
              Book now
            </Link>
            <Link href="/admin" className="rounded-lg border border-brand-200 px-4 py-2 text-brand-700 hover:bg-brand-50">
              Admin login
            </Link>
          </div>
        </div>
        <div className="mt-8">
          <ParkingSearchForm />
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Instant confirmation",
            description: "Receive QR-ready vouchers with every booking and live flight status tracking.",
          },
          {
            title: "Safe & insured",
            description: "ParkFlow-inspired workflows keep vehicles tracked from check-in to return.",
          },
          {
            title: "Simple pricing",
            description: "Seasonal rules, terminal surcharges and promos all handled in one place.",
          },
        ].map((item) => (
          <article key={item.title} className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
