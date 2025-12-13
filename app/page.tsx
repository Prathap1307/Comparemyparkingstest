import Link from "next/link";
import { ParkingSearchForm } from "@/components/parking-search-form";
import { Metadata } from "next";
import { CheckCircle2, Clock3, Headphones, Lock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "CompareMyParking.co.uk | Heathrow & Gatwick Airport Parking",
  description:
    "Premium meet & greet and shuttle parking for UK airports. Transparent pricing, secure handovers, and live flight tracking.",
};

const trustPoints = [
  { title: "Secure payments", copy: "PCI-compliant checkout with bank-level encryption.", icon: <Lock className="h-5 w-5" /> },
  { title: "UK support", copy: "Ops specialists on-hand 24/7 for flight changes.", icon: <Headphones className="h-5 w-5" /> },
  { title: "Transparent pricing", copy: "No surprise fees — terminals and surcharges shown upfront.", icon: <ShieldCheck className="h-5 w-5" /> },
  { title: "On-time handovers", copy: "Flight tracking keeps drivers aligned with your arrival.", icon: <Clock3 className="h-5 w-5" /> },
];

export default function PublicHome() {
  return (
    <main className="bg-gradient-to-b from-slate-50 to-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 md:flex-row md:items-center">
        <div className="space-y-6 md:w-1/2">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            CompareMyParking.co.uk
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Heathrow & Gatwick airport parking without the stress.
            </h1>
            <p className="text-lg text-slate-600">
              Compare premium meet & greet or shuttle operators, lock pricing instantly, and keep your driver in sync with live flight data.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-800">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Fully insured handovers
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Live flight monitoring
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href="#compare"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Start comparing
            </Link>
            <Link
              href="/book"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300"
            >
              Book now
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Book with confidence</p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live pricing</span>
            </div>
            <div className="mt-4">
              <ParkingSearchForm />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="rounded-lg bg-slate-50 p-3">Secure payments & instant vouchers.</div>
              <div className="rounded-lg bg-slate-50 p-3">Drivers meet you kerbside with ID and proof.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="compare" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Why travellers choose us</p>
            <h2 className="text-2xl font-semibold text-slate-900">Premium service at clear prices</h2>
            <p className="text-sm text-slate-600">We benchmark vetted partners and surface the best-value options for your times.</p>
          </div>
          <Link href="/book" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            View availability →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Meet & greet", "Shuttle", "Valet"].map((product, idx) => (
            <article key={product} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{product}</p>
                {idx === 0 ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Best value</span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Kerbside handover with verified drivers, photo capture, and live arrival monitoring.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Secure key handling</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Parking insured & CCTV</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Delay cover built-in</li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Trust & safety</p>
              <h3 className="text-3xl font-semibold text-white">Every booking is protected.</h3>
              <p className="text-slate-200">
                Drivers are ID-checked, car parks are insured, and payments are processed through secure partners. Transparent vouchers show every fee before you pay.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
                {trustPoints.map((point) => (
                  <div key={point.title} className="flex items-start gap-2 rounded-xl bg-white/5 p-3">
                    <span className="text-emerald-300">{point.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{point.title}</p>
                      <p className="text-xs text-slate-200">{point.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-xl">
              <h4 className="text-lg font-semibold">Traveller stories</h4>
              <p className="mt-2 text-sm text-slate-200">
                “Switched from airport-run car parks. Driver was waiting, photos taken, and I tracked my return flight in the app. The clearest airport parking experience I’ve had.”
              </p>
              <p className="mt-4 text-sm font-semibold text-emerald-200">Amelia — Heathrow T3</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
