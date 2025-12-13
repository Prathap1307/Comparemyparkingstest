import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateBookingStatusAction } from "./actions";
import { format } from "date-fns";
import { CalendarClock, CarFront, CheckCircle2, Clock, MapPin } from "lucide-react";

async function updateStatus(id: string, status: string) {
  "use server";
  await updateBookingStatusAction(id, status);
  revalidatePath("/admin/bookings");
}

function Pill({ label, tone }: { label: string; tone?: "green" | "amber" | "slate" }) {
  const tones: Record<NonNullable<typeof tone>, string> = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone ? tones[tone] : tones.slate}`}>{label}</span>;
}

interface BookingsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const arrivalFrom = typeof searchParams?.arrivalFrom === "string" ? new Date(searchParams.arrivalFrom) : undefined;
  const arrivalTo = typeof searchParams?.arrivalTo === "string" ? new Date(searchParams.arrivalTo) : undefined;
  const returnFrom = typeof searchParams?.returnFrom === "string" ? new Date(searchParams.returnFrom) : undefined;
  const returnTo = typeof searchParams?.returnTo === "string" ? new Date(searchParams.returnTo) : undefined;
  const status = typeof searchParams?.status === "string" && searchParams.status !== "all" ? searchParams.status : undefined;
  const terminal = typeof searchParams?.terminal === "string" && searchParams.terminal !== "all" ? searchParams.terminal : undefined;

  const bookings = await prisma.booking.findMany({
    where: {
      ...(arrivalFrom || arrivalTo
        ? { arrivalAt: { gte: arrivalFrom, lte: arrivalTo } }
        : {}),
      ...(returnFrom || returnTo
        ? { returnAt: { gte: returnFrom, lte: returnTo } }
        : {}),
      ...(status ? { status } : {}),
      ...(terminal ? { terminal } : {}),
    },
    orderBy: { arrivalAt: "asc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Live manifest</p>
          <h1 className="text-2xl font-semibold text-slate-900">Bookings</h1>
          <p className="text-sm text-slate-600">Filter by arrival, return, terminal, or operational status.</p>
        </div>
        <Link
          href="/admin/bookings/new"
          className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Create booking
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <form className="grid grid-cols-2 gap-3 md:col-span-3 md:grid-cols-6" method="get">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Arrival from
            <input
              name="arrivalFrom"
              type="date"
              defaultValue={arrivalFrom ? format(arrivalFrom, "yyyy-MM-dd") : ""}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Arrival to
            <input
              name="arrivalTo"
              type="date"
              defaultValue={arrivalTo ? format(arrivalTo, "yyyy-MM-dd") : ""}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Return from
            <input
              name="returnFrom"
              type="date"
              defaultValue={returnFrom ? format(returnFrom, "yyyy-MM-dd") : ""}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Return to
            <input
              name="returnTo"
              type="date"
              defaultValue={returnTo ? format(returnTo, "yyyy-MM-dd") : ""}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Terminal
            <select
              name="terminal"
              defaultValue={terminal ?? "all"}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="Heathrow T2">Heathrow T2</option>
              <option value="Heathrow T3">Heathrow T3</option>
              <option value="Gatwick South">Gatwick South</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Status
            <select
              name="status"
              defaultValue={status ?? "all"}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked in</option>
              <option value="parked">Parked</option>
              <option value="returned">Returned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <div className="col-span-2 flex items-end gap-2 md:col-span-6">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Apply filters
            </button>
            <Link
              href="/admin/bookings"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </form>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signal</p>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-700" />Booked by arrival time</div>
            <div className="flex items-center gap-2"><CarFront className="h-4 w-4 text-slate-600" />Includes return leg</div>
            <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-amber-600" />Max 50 rows</div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              {["Booking", "Customer", "Vehicle", "Terminal", "Arrival", "Return", "Status", "Actions"].map((header) => (
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
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{booking.customerName}</div>
                  <p className="text-xs text-slate-500">{booking.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{booking.vehicleReg}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-400" /> {booking.terminal}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{format(booking.arrivalAt, "d MMM, HH:mm")}</td>
                <td className="px-4 py-3 text-slate-700">{format(booking.returnAt, "d MMM, HH:mm")}</td>
                <td className="px-4 py-3">
                  <Pill
                    label={booking.status.replace("_", " ")}
                    tone={
                      booking.status === "confirmed"
                        ? "green"
                        : booking.status === "checked_in"
                          ? "amber"
                          : "slate"
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {["confirmed", "checked_in", "parked", "returned", "completed"].map((state) => (
                      <form key={state} action={async () => updateStatus(booking.id, state)}>
                        <button
                          type="submit"
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                        >
                          {state}
                        </button>
                      </form>
                    ))}
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Details
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={8}>
                  No bookings match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
