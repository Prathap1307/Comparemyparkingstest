"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { CheckCircle2, Lock, ShieldCheck } from "lucide-react";

const bookingSchema = z.object({
  from: z.string(),
  to: z.string(),
  terminal: z.string(),
  customerName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  vehicleReg: z.string().min(3),
});

const steps = ["Trip", "Driver", "Confirm"] as const;

export function BookingFlow() {
  const search = useSearchParams();
  const defaults = useMemo(
    () => ({
      from: search.get("from") ?? "",
      to: search.get("to") ?? "",
      terminal: search.get("terminal") ?? "Heathrow T2",
    }),
    [search],
  );
  const [form, setForm] = useState({
    ...defaults,
    customerName: "",
    phone: "",
    email: "",
    vehicleReg: "",
  });
  const [step, setStep] = useState<(typeof steps)[number]>(steps[0]);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const summary = (
    <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Trip overview</p>
          <p className="text-lg font-semibold text-slate-900">{form.terminal}</p>
          <p className="text-sm text-slate-600">{form.from || "Select dates"} → {form.to || ""}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
          <p className="text-2xl font-semibold text-slate-900">£98.00</p>
          <p className="text-xs text-slate-500">Includes fees & insured parking</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-xs text-slate-700">
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Flight monitoring included</div>
        <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-emerald-600" /> Secure payments by Stripe</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Free cancellation within 24h</div>
      </div>
    </div>
  );

  const handleSubmit = () => {
    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      setError("Please complete all required fields.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-semibold">Booking confirmed</p>
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">We’re holding your parking.</h1>
        <p className="mt-2 text-slate-600">
          Reference <span className="font-semibold">CMP-{form.vehicleReg.toUpperCase()}</span>. A confirmation email and voucher are on the way. Our team will track your flight and adjust handover timing if needed.
        </p>
        <p className="mt-4 text-xs text-slate-500">(Payment placeholder – integrate Stripe to capture card details.)</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {steps.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${step === item ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600"}`}>
                {steps.indexOf(item) + 1}
              </span>
              <span className={step === item ? "text-slate-900" : "text-slate-500"}>{item}</span>
            </div>
          ))}
        </div>

        {step === "Trip" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Step 1</p>
                <h2 className="text-lg font-semibold text-slate-900">Trip details</h2>
              </div>
              <span className="text-xs font-semibold text-emerald-700">Live capacity</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[{ key: "from", label: "Arrival" }, { key: "to", label: "Return" }].map((field) => (
                <label key={field.key} className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                  {field.label}
                  <input
                    type="date"
                    value={(form as Record<string, string>)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </label>
              ))}
              <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700 md:col-span-2">
                Terminal
                <select
                  value={form.terminal}
                  onChange={(e) => setForm({ ...form, terminal: e.target.value })}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Heathrow T2">Heathrow T2</option>
                  <option value="Heathrow T3">Heathrow T3</option>
                  <option value="Gatwick South">Gatwick South</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                type="button"
                onClick={() => setStep("Driver")}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "Driver" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Step 2</p>
                <h2 className="text-lg font-semibold text-slate-900">Driver & vehicle</h2>
              </div>
              <span className="text-xs font-semibold text-emerald-700">Secure handover</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[{ key: "customerName", label: "Driver name" }, { key: "phone", label: "Mobile" }, { key: "email", label: "Email", type: "email" }, { key: "vehicleReg", label: "Vehicle registration" }].map((field) => (
                <label key={field.key} className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                  {field.label}
                  <input
                    type={(field as { type?: string }).type ?? "text"}
                    value={(form as Record<string, string>)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                onClick={() => setStep("Trip")}
              >
                Back
              </button>
              <button
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                type="button"
                onClick={() => setStep("Confirm")}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "Confirm" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Step 3</p>
                <h2 className="text-lg font-semibold text-slate-900">Review & confirm</h2>
              </div>
              <span className="text-xs font-semibold text-emerald-700">Almost done</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span>Handover</span>
                <span className="font-semibold">{form.terminal}</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span>Dates</span>
                <span className="font-semibold">{form.from || "-"} → {form.to || "-"}</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span>Driver</span>
                <span className="font-semibold">{form.customerName || "-"}</span>
              </li>
            </ul>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex justify-between">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                onClick={() => setStep("Driver")}
              >
                Back
              </button>
              <button
                className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                type="button"
                onClick={handleSubmit}
              >
                Confirm booking
              </button>
            </div>
          </div>
        )}
      </div>
      {summary}
    </div>
  );
}
