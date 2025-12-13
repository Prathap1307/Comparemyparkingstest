import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBookingStatusAction } from "../actions";
import { revalidatePath } from "next/cache";
import { fetchFlightStatus } from "@/lib/flight-providers";
import { format } from "date-fns";
import { Airplane, FileText, PlaneTakeoff, ShieldCheck, User } from "lucide-react";

async function updateStatus(id: string, status: string) {
  "use server";
  await updateBookingStatusAction(id, status);
  revalidatePath(`/admin/bookings/${id}`);
}

interface Params {
  params: { id: string };
}

export default async function BookingDetailPage({ params }: Params) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return notFound();
  const flightOut = booking.flightOutNumber ? await fetchFlightStatus(booking.flightOutNumber) : null;
  const flightIn = booking.flightInNumber ? await fetchFlightStatus(booking.flightInNumber) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Booking ref {booking.bookingRef}</p>
          <h1 className="text-3xl font-semibold text-slate-900">{booking.customerName}</h1>
          <p className="text-sm text-slate-600">{booking.email} · {booking.phone}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/bookings/${booking.id}/print`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            <FileText className="h-4 w-4" /> Print voucher
          </Link>
          <Link
            href={`/admin/bookings/${booking.id}/checkin`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <ShieldCheck className="h-4 w-4" /> Check-in sheet
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <User className="h-4 w-4 text-slate-500" /> Customer
          </div>
          <dl className="mt-3 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><dt className="text-slate-500">Phone</dt><dd className="font-semibold">{booking.phone}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Vehicle</dt><dd className="font-semibold">{booking.vehicleReg}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Service</dt><dd className="font-semibold capitalize">{booking.serviceType}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Terminal</dt><dd className="font-semibold">{booking.terminal}</dd></div>
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <Airplane className="h-4 w-4 text-slate-500" /> Travel
          </div>
          <dl className="mt-3 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><dt className="text-slate-500">Arrival</dt><dd className="font-semibold">{format(booking.arrivalAt, "d MMM, HH:mm")}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Return</dt><dd className="font-semibold">{format(booking.returnAt, "d MMM, HH:mm")}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Price</dt><dd className="font-semibold">£{booking.price}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Payment</dt><dd className="font-semibold capitalize">{booking.paymentStatus}</dd></div>
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <PlaneTakeoff className="h-4 w-4 text-slate-500" /> Flight tracking
          </div>
          <div className="mt-3 space-y-3 text-sm text-slate-700">
            {[{ label: "Outbound", data: flightOut, fallback: booking.flightOutNumber }, { label: "Return", data: flightIn, fallback: booking.flightInNumber }].map((leg) => (
              <div key={leg.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>{leg.label}</span>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-emerald-700">{leg.data?.provider ?? "standby"}</span>
                </div>
                {leg.data ? (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-semibold text-slate-900">Status: {leg.data.status}</p>
                    <p className="text-xs text-slate-600">Dep: {leg.data.departure.airport ?? "tbc"}</p>
                    <p className="text-xs text-slate-600">Arr: {leg.data.arrival.airport ?? "tbc"}</p>
                    <p className="text-xs text-slate-500">Updated {format(new Date(leg.data.lastUpdated), "HH:mm")}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">No flight linked ({leg.fallback ?? "add in booking"}).</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Status workflow</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {["confirmed", "checked_in", "parked", "returned", "completed", "cancelled"].map((status) => (
            <form key={status} action={async () => updateStatus(booking.id, status)}>
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-emerald-200" type="submit">
                {status}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
