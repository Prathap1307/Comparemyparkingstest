import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateBookingStatusAction } from "./actions";
import { revalidatePath } from "next/cache";

async function updateStatus(id: string, status: string) {
  "use server";
  await updateBookingStatusAction(id, status);
  revalidatePath("/admin/bookings");
}

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Bookings</h1>
          <p className="text-sm text-slate-600">Recent reservations with workflow controls.</p>
        </div>
        <Link href="/admin/bookings/new" className="rounded-lg bg-brand-600 px-4 py-2 text-white shadow hover:bg-brand-700">
          New booking
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              {["Booking ref", "Customer", "Vehicle", "Terminal", "Arrival", "Status", "Actions"].map((header) => (
                <th key={header} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">{booking.bookingRef}</td>
                <td className="px-4 py-3">{booking.customerName}</td>
                <td className="px-4 py-3">{booking.vehicleReg}</td>
                <td className="px-4 py-3">{booking.terminal}</td>
                <td className="px-4 py-3">{booking.arrivalAt.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="badge capitalize">{booking.status.replace("_", " ")}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {["confirmed", "checked_in", "parked", "returned", "completed"].map((status) => (
                      <form key={status} action={async () => updateStatus(booking.id, status)}>
                        <button
                          type="submit"
                          className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-brand-50"
                        >
                          {status}
                        </button>
                      </form>
                    ))}
                    <Link href={`/admin/bookings/${booking.id}`} className="text-sm font-semibold text-brand-700">
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
