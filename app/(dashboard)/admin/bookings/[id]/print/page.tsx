import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Params { params: { id: string } }

export default async function BookingPrintPage({ params }: Params) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-6 bg-white p-8 text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <p className="text-sm font-semibold text-brand-700">CompareMyPrking Voucher</p>
          <h1 className="text-2xl font-bold">{booking.customerName}</h1>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold">Booking ref {booking.bookingRef}</p>
          <p className="text-slate-600">Customer support: 0208 111 2222</p>
        </div>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Customer</h2>
          <p className="font-medium">{booking.customerName}</p>
          <p className="text-sm text-slate-600">{booking.phone}</p>
          <p className="text-sm text-slate-600">{booking.email}</p>
        </div>
        <div className="card p-4">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Vehicle</h2>
          <p className="font-medium">{booking.vehicleReg}</p>
          <p className="text-sm text-slate-600">{booking.makeModel}</p>
          <p className="text-sm text-slate-600">Colour: {booking.color ?? "-"}</p>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Flight</h3>
          <p>Depart: {booking.flightOutNumber ?? "-"}</p>
          <p>Return: {booking.flightInNumber ?? "-"}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-semibold uppercase text-slate-500">Parking</h3>
          <p>Terminal: {booking.terminal}</p>
          <p>Arrival: {booking.arrivalAt.toLocaleString()}</p>
          <p>Return: {booking.returnAt.toLocaleString()}</p>
        </div>
      </section>
      <section className="card p-4">
        <h3 className="text-sm font-semibold uppercase text-slate-500">Terms &amp; Conditions</h3>
        <p className="text-sm text-slate-600">
          Please present this voucher on arrival. Vehicles are photographed and mileage recorded. Any damage claims must be reported before leaving the car park. Full terms available at comparemyprking.co.uk/terms.
        </p>
      </section>
    </div>
  );
}
