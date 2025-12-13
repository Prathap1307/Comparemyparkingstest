import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateBookingStatusAction } from "../actions";
import { revalidatePath } from "next/cache";

async function updateStatus(id: string, status: string) {
  "use server";
  await updateBookingStatusAction(id, status);
  revalidatePath(`/admin/bookings/${id}`);
}

interface Params { params: { id: string } }

export default async function BookingDetailPage({ params }: Params) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return notFound();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Booking ref {booking.bookingRef}</p>
          <h1 className="text-2xl font-semibold text-slate-900">{booking.customerName}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/bookings/${booking.id}/print`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
            Print voucher
          </Link>
          <Link href={`/admin/bookings/${booking.id}/checkin`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
            Check-in sheet
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-slate-900">Customer</h2>
          <p className="text-sm text-slate-600">{booking.phone}</p>
          <p className="text-sm text-slate-600">{booking.email}</p>
        </div>
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-slate-900">Vehicle</h2>
          <p className="text-sm text-slate-600">{booking.vehicleReg}</p>
          <p className="text-sm text-slate-600">{booking.makeModel}</p>
        </div>
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-slate-900">Flight</h2>
          <p className="text-sm text-slate-600">Outbound: {booking.flightOutNumber ?? "-"}</p>
          <p className="text-sm text-slate-600">Return: {booking.flightInNumber ?? "-"}</p>
        </div>
      </div>
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-900">Status workflow</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {["confirmed", "checked_in", "parked", "returned", "completed", "cancelled"].map((status) => (
            <form key={status} action={async () => updateStatus(booking.id, status)}>
              <button className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-brand-50" type="submit">
                {status}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
