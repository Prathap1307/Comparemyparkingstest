import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ClipboardPen, ShieldCheck } from "lucide-react";

interface Params { params: { id: string } }

export default async function CheckinPage({ params }: Params) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return notFound();
  return (
    <div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <header className="flex flex-col justify-between gap-2 border-b border-slate-200 pb-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Check-in inspection</p>
          <h1 className="text-2xl font-semibold text-slate-900">{booking.customerName} · {booking.vehicleReg}</h1>
          <p className="text-sm text-slate-600">Arrival {booking.arrivalAt.toLocaleString()} · Terminal {booking.terminal}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
          <ShieldCheck className="h-4 w-4" /> Secure handover
        </span>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <ClipboardPen className="h-4 w-4 text-slate-500" /> Condition checklist
          </div>
          <ul className="space-y-3 text-sm text-slate-700">
            {["No visible damage", "Photographed", "Tyres inspected", "Fuel level recorded", "Mileage captured"].map((item) => (
              <li key={item} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                <span>{item}</span>
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <ClipboardPen className="h-4 w-4 text-slate-500" /> Notes
          </div>
          <textarea
            className="h-40 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
            placeholder="Record visible damage, accessories, mileage and fuel readings"
            defaultValue={booking.notes ?? ""}
          />
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-600">
            Driver + customer signature placeholder
          </div>
        </div>
      </section>
    </div>
  );
}
