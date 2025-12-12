"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../../../style.css";

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

export default function PrintBooking({ params }) {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${params.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load booking");
        setBooking({
          id: normalize(data.id) || normalize(data.orderId),
          orderId: normalize(data.orderId) || normalize(data.id),
          parkingName: normalize(data.ParkingName),
          location: normalize(data.Location),
          bookingDetails: normalize(data.bookingDetails) || {},
          customerDetails: normalize(data.customerDetails) || {},
          services: normalize(data.services) || [],
          instruction: normalize(data.instruction),
        });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBooking();
  }, [params.id]);

  if (error) {
    return (
      <div className="admin-main">
        <div className="panel">
          <p className="text-red-600 font-bold">{error}</p>
          <Link className="tag" href="/admin">Back to admin</Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="admin-main">
        <div className="panel">
          <p className="font-semibold">Loading booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-main" style={{ background: "#f8fafc" }}>
      <div className="print-shell">
        <div className="print-header">
          <div>
            <p className="print-brand">CompareMyParkings</p>
            <p className="text-sm text-slate-500 font-semibold">Meet & Greet Driver Sheet</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Booking number</p>
            <p className="text-2xl font-black text-slate-900">{booking.orderId}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="drawer-label">Customer</p>
            <p className="drawer-value text-lg">{booking.customerDetails.title} {booking.customerDetails.firstName} {booking.customerDetails.lastName}</p>
            <p className="text-slate-600 font-semibold">{booking.customerDetails.contactNumber}</p>
          </div>
          <div>
            <p className="drawer-label">Vehicle</p>
            <p className="drawer-value text-lg">{booking.customerDetails.carReg}</p>
            <p className="text-slate-600 font-semibold">{booking.customerDetails.vehicleColor || booking.bookingDetails.vehicleColor || ""}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="drawer-label">Drop-off</p>
            <p className="drawer-value text-xl">{booking.bookingDetails.startDate} · {booking.bookingDetails.startTime}</p>
            <p className="text-slate-600 font-semibold">Terminal {booking.bookingDetails.terminal}</p>
          </div>
          <div>
            <p className="drawer-label">Pickup</p>
            <p className="drawer-value text-xl">{booking.bookingDetails.endDate} · {booking.bookingDetails.endTime}</p>
            <p className="text-slate-600 font-semibold">Terminal {booking.bookingDetails.terminal}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="drawer-label">Flight</p>
            <p className="drawer-value">{booking.customerDetails.flightNumber || "N/A"}</p>
          </div>
          <div>
            <p className="drawer-label">Instructions</p>
            <p className="drawer-value text-sm leading-tight">{booking.instruction || booking.customerDetails.customerInstruction || "Standard handover"}</p>
          </div>
        </div>

        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <p className="text-sm font-semibold text-slate-600">Included services</p>
          <p className="font-bold text-slate-800">{(booking.services || []).join(", ") || "Meet & Greet parking"}</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Scan / Ref</p>
            <p className="text-xl font-black">{booking.orderId}</p>
          </div>
          <button className="button primary" onClick={() => window.print()}>Print</button>
        </div>
      </div>
    </div>
  );
}
