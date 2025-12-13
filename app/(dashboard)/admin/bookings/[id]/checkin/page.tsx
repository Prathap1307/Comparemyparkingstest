import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Params { params: { id: string } }

export default async function CheckinPage({ params }: Params) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return notFound();
  return (
    <div className="mx-auto max-w-4xl space-y-6 bg-white p-8 text-slate-900">
      <header className="border-b border-slate-200 pb-4">
        <p className="text-sm text-slate-600">Vehicle check sheet</p>
        <h1 className="text-2xl font-semibold">{booking.customerName}</h1>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Customer details</h2>
          <p>{booking.customerName}</p>
          <p className="text-sm text-slate-600">{booking.phone}</p>
        </div>
        <div className="card p-4">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Vehicle condition</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {["No visible damage", "Photographed", "Tyres inspected", "Fuel level recorded", "Mileage captured"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="card p-4">
        <h3 className="text-sm font-semibold uppercase text-slate-500">Signature</h3>
        <p className="text-sm text-slate-600">Driver signature confirms car condition and mileage noted.</p>
        <div className="mt-6 h-24 rounded-lg border border-dashed border-slate-300" />
      </section>
    </div>
  );
}
