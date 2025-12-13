"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { z } from "zod";

const bookingSchema = z.object({
  from: z.string(),
  to: z.string(),
  terminal: z.string(),
  customerName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  vehicleReg: z.string().min(3),
});

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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="card p-8 space-y-4">
        <h1 className="text-2xl font-semibold">Booking confirmed</h1>
        <p className="text-slate-600">
          We generated your booking reference <span className="font-semibold">CMP-{form.vehicleReg.toUpperCase()}</span>. You will receive email/SMS shortly.
        </p>
        <p className="text-sm text-slate-500">(Payment placeholder – integrate Stripe to capture card details.)</p>
      </div>
    );
  }

  return (
    <form
      className="card space-y-4 p-8"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = bookingSchema.safeParse(form);
        if (!parsed.success) {
          setError("Please complete all required fields.");
          return;
        }
        setError(null);
        setSubmitted(true);
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{form.terminal} · {form.from || "Select dates"} → {form.to || ""}</p>
          <h1 className="text-xl font-semibold">Reserve your parking</h1>
        </div>
        <div className="badge">£95 estimated</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { key: "customerName", label: "Customer name" },
          { key: "phone", label: "Mobile" },
          { key: "email", label: "Email", type: "email" },
          { key: "vehicleReg", label: "Vehicle registration" },
        ].map((field) => (
          <label key={field.key} className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            {field.label}
            <input
              type={field.type ?? "text"}
              value={(form as Record<string, string>)[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none"
              required
            />
          </label>
        ))}
      </div>
      <button type="submit" className="rounded-lg bg-brand-600 px-4 py-3 text-white shadow hover:bg-brand-700">
        Confirm and hold space
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
