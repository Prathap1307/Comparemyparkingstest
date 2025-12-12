import Link from "next/link";
import { getItemById } from "@/lib/Database/Utils-db";
import "../../style.css";

const TABLE_NAME = process.env.BOOKINGS_TABLE;

const normalize = (value) => {
  if (value?.S) return value.S;
  if (value?.N) return value.N;
  if (value?.BOOL !== undefined) return value.BOOL;
  if (value?.L) return value.L.map(normalize);
  if (value?.M) {
    const obj = {};
    Object.keys(value.M).forEach((key) => (obj[key] = normalize(value.M[key])));
    return obj;
  }
  return value ?? "";
};

export default async function BookingDetail({ params }) {
  const booking = await getItemById(TABLE_NAME, params.id);
  const normalized = booking
    ? {
        id: normalize(booking.id) || normalize(booking.orderId),
        orderId: normalize(booking.orderId) || normalize(booking.id),
        parkingName: normalize(booking.ParkingName),
        location: normalize(booking.Location),
        bookingDetails: normalize(booking.bookingDetails) || {},
        customerDetails: normalize(booking.customerDetails) || {},
        services: normalize(booking.services) || [],
        instruction: normalize(booking.instruction),
        createdAt: normalize(booking.createdAt),
        updatedAt: normalize(booking.updatedAt),
      }
    : null;

  if (!normalized) {
    return (
      <div className="admin-main">
        <div className="panel">
          <p className="text-red-600 font-bold">Booking not found.</p>
          <Link className="tag" href="/admin">Back to admin</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-main">
      <div className="panel space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="tag">Booking detail</p>
            <h1 className="text-3xl font-black">{normalized.orderId}</h1>
            <p className="text-slate-500 font-semibold">{normalized.parkingName} · {normalized.location}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link className="tag" href={`/admin/bookings/${normalized.id}/print`} target="_blank">Print</Link>
            <Link className="tag" href="/admin">Back</Link>
          </div>
        </div>

        <div className="drawer-section">
          <div>
            <p className="drawer-label">Customer</p>
            <p className="drawer-value">{normalized.customerDetails.title} {normalized.customerDetails.firstName} {normalized.customerDetails.lastName}</p>
          </div>
          <div>
            <p className="drawer-label">Contact</p>
            <p className="drawer-value">{normalized.customerDetails.contactNumber}</p>
          </div>
          <div>
            <p className="drawer-label">Email</p>
            <p className="drawer-value break-all">{normalized.customerDetails.email}</p>
          </div>
        </div>

        <div className="drawer-section">
          <div>
            <p className="drawer-label">Vehicle</p>
            <p className="drawer-value">{normalized.customerDetails.carReg}</p>
          </div>
          <div>
            <p className="drawer-label">Colour</p>
            <p className="drawer-value">{normalized.customerDetails.vehicleColor || normalized.bookingDetails.vehicleColor || "-"}</p>
          </div>
          <div>
            <p className="drawer-label">Flight number</p>
            <p className="drawer-value">{normalized.customerDetails.flightNumber || "-"}</p>
          </div>
        </div>

        <div className="drawer-section">
          <div>
            <p className="drawer-label">Drop-off</p>
            <p className="drawer-value">{normalized.bookingDetails.startDate} {normalized.bookingDetails.startTime}</p>
          </div>
          <div>
            <p className="drawer-label">Pickup</p>
            <p className="drawer-value">{normalized.bookingDetails.endDate} {normalized.bookingDetails.endTime}</p>
          </div>
          <div>
            <p className="drawer-label">Terminal</p>
            <p className="drawer-value">{normalized.bookingDetails.terminal}</p>
          </div>
        </div>

        <div className="drawer-section">
          <div>
            <p className="drawer-label">Status</p>
            <p className="drawer-value capitalize">{normalized.bookingDetails.status}</p>
          </div>
          <div>
            <p className="drawer-label">Duration</p>
            <p className="drawer-value">{normalized.bookingDetails.duration} days</p>
          </div>
          <div>
            <p className="drawer-label">Total Paid</p>
            <p className="drawer-value">£{normalized.bookingDetails.totalPrice}</p>
          </div>
        </div>

        <div>
          <p className="drawer-label">Notes</p>
          <p className="drawer-value text-sm leading-tight">{normalized.instruction || normalized.customerDetails.customerInstruction || "No notes provided."}</p>
        </div>
      </div>
    </div>
  );
}
