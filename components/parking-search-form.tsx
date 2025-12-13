"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const searchSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  terminal: z.string().min(1),
});

export function ParkingSearchForm() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [terminal, setTerminal] = useState("Heathrow T2");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4 md:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = searchSchema.safeParse({ from, to, terminal });
        if (!parsed.success) {
          setError("Please provide all search fields.");
          return;
        }
        setError(null);
        const params = new URLSearchParams(parsed.data).toString();
        router.push(`/book?${params}`);
      }}
    >
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Drop-off
        <input
          type="datetime-local"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none"
          required
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Return
        <input
          type="datetime-local"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none"
          required
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Terminal
        <select
          value={terminal}
          onChange={(e) => setTerminal(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none"
        >
          <option>Heathrow T2</option>
          <option>Heathrow T3</option>
          <option>Heathrow T5</option>
          <option>Gatwick North</option>
          <option>Gatwick South</option>
        </select>
      </label>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 px-4 py-3 text-white shadow hover:bg-brand-700"
        >
          Check price
        </button>
      </div>
      {error ? <p className="col-span-full text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
