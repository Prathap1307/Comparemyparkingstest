"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const normalizeValue = (value) => {
  if (value?.S) return value.S;
  if (value?.N) return value.N;
  if (value?.BOOL !== undefined) return value.BOOL;
  if (value?.L) return value.L.map((item) => normalizeValue(item));
  if (value?.M) {
    const obj = {};
    Object.keys(value.M).forEach((key) => {
      obj[key] = normalizeValue(value.M[key]);
    });
    return obj;
  }
  return value ?? "";
};

const normalizeBooking = (booking) => {
  if (!booking) return null;
  const bookingDetails = normalizeValue(booking.bookingDetails) || {};
  const customerDetails = normalizeValue(booking.customerDetails) || {};
  const services = normalizeValue(booking.services) || [];

  return {
    id: normalizeValue(booking.id) || normalizeValue(booking.orderId),
    orderId: normalizeValue(booking.orderId) || normalizeValue(booking.id),
    parkingName: normalizeValue(booking.ParkingName),
    location: normalizeValue(booking.Location),
    bookingDetails,
    customerDetails,
    services,
    instruction: normalizeValue(booking.instruction),
    isTest: normalizeValue(booking.isTest),
    createdAt: normalizeValue(booking.createdAt),
    updatedAt: normalizeValue(booking.updatedAt),
    paymentIntentId: normalizeValue(booking.paymentIntentId),
  };
};

const statusOptions = [
  "confirmed",
  "pending",
  "dropoff-complete",
  "pickup-complete",
  "cancelled",
];

const statusClass = (status) => {
  if (!status) return "status-pill status-pending";
  const map = {
    confirmed: "status-pill status-confirmed",
    pending: "status-pill status-pending",
    "dropoff-complete": "status-pill status-dropoff",
    "pickup-complete": "status-pill status-pickup",
    cancelled: "status-pill status-cancelled",
  };
  return map[status] || "status-pill status-pending";
};

const flightColor = (status) => {
  if (!status) return "flight-gray";
  if (["landed", "arrived", "arrival", "arrived gate"].includes(status.toLowerCase())) return "flight-green";
  if (["baggage", "baggage claim", "carousel", "bags"].includes(status.toLowerCase())) return "flight-violet";
  return "flight-gray";
};

export default function AdminHome() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [terminalFilter, setTerminalFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [flowFilter, setFlowFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(90);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [vehicleLookupResult, setVehicleLookupResult] = useState(null);
  const [vehicleLookupLoading, setVehicleLookupLoading] = useState(false);
  const [vehicleReg, setVehicleReg] = useState("");
  const [editing, setEditing] = useState(false);
  const [editableBooking, setEditableBooking] = useState(null);

  useEffect(() => {
    const savedInterval = localStorage.getItem("admin_refresh_interval");
    const savedAutoRefresh = localStorage.getItem("admin_auto_refresh");
    if (savedInterval) setRefreshInterval(Number(savedInterval));
    if (savedAutoRefresh) setAutoRefresh(savedAutoRefresh === "true");
  }, []);

  const fetchBookings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/bookings", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load bookings");
      const rawData = await response.json();
      const normalized = (rawData || []).map(normalizeBooking).filter(Boolean);
      setBookings(normalized);
      if (!selectedBooking && normalized.length) {
        setSelectedBooking(normalized[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch bookings");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [selectedBooking]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => fetchBookings(true), refreshInterval * 1000);
    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval, fetchBookings]);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const bookingDate = booking.bookingDetails?.startDate || booking.createdAt?.slice(0, 10);
        return bookingDate === selectedDate;
      })
      .filter((booking) => {
        if (terminalFilter === "all") return true;
        return (booking.bookingDetails?.terminal || "").toLowerCase() === terminalFilter.toLowerCase();
      })
      .filter((booking) => {
        if (statusFilter === "all") return true;
        return (booking.bookingDetails?.status || booking.status || "").toLowerCase() === statusFilter.toLowerCase();
      })
      .filter((booking) => {
        if (flowFilter === "all") return true;
        const dropDate = booking.bookingDetails?.startDate;
        const pickupDate = booking.bookingDetails?.endDate;
        if (flowFilter === "drop" && dropDate === selectedDate) return true;
        if (flowFilter === "pickup" && pickupDate === selectedDate) return true;
        return false;
      })
      .filter((booking) => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (
          (booking.orderId || "").toLowerCase().includes(term) ||
          (booking.customerDetails?.carReg || "").toLowerCase().includes(term) ||
          `${booking.customerDetails?.firstName || ""} ${booking.customerDetails?.lastName || ""}`
            .toLowerCase()
            .includes(term)
        );
      });
  }, [bookings, selectedDate, terminalFilter, statusFilter, flowFilter, search]);

  const kpi = useMemo(() => {
    const total = filteredBookings.length;
    const dropoffs = filteredBookings.filter((b) => b.bookingDetails?.startDate === selectedDate).length;
    const pickups = filteredBookings.filter((b) => b.bookingDetails?.endDate === selectedDate).length;
    const flights = filteredBookings.filter((b) => b.customerDetails?.flightNumber).length;
    const landed = filteredBookings.filter(
      (b) => ["landed", "arrived"].includes((b.bookingDetails?.flightStatus || "").toLowerCase())
    ).length;
    return { total, dropoffs, pickups, flights, landed };
  }, [filteredBookings, selectedDate]);

  const handleStatusChange = async (booking, nextStatus) => {
    try {
      const payload = {
        id: booking.id,
        bookingDetails: {
          ...(booking.bookingDetails || {}),
          status: nextStatus,
        },
      };
      const response = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update status");
      const updated = await response.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, bookingDetails: updated.bookingDetails || payload.bookingDetails } : b))
      );
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking((prev) => ({ ...prev, bookingDetails: updated.bookingDetails || payload.bookingDetails }));
      }
    } catch (err) {
      alert(err.message || "Unable to update status");
    }
  };

  const startEdit = (booking) => {
    setEditing(true);
    setEditableBooking({
      ...booking,
      customerDetails: {
        title: booking.customerDetails?.title || "",
        firstName: booking.customerDetails?.firstName || "",
        lastName: booking.customerDetails?.lastName || "",
        email: booking.customerDetails?.email || "",
        contactNumber: booking.customerDetails?.contactNumber || "",
        carReg: booking.customerDetails?.carReg || "",
        vehicleColor: booking.customerDetails?.vehicleColor || "",
        departureTerminal: booking.customerDetails?.departureTerminal || booking.bookingDetails?.terminal || "",
        flightNumber: booking.customerDetails?.flightNumber || "",
        returnFlightNumber: booking.customerDetails?.returnFlightNumber || "",
        arrivalTerminal: booking.customerDetails?.arrivalTerminal || "",
        customerInstruction: booking.customerDetails?.customerInstruction || "",
      },
      bookingDetails: {
        ...booking.bookingDetails,
        terminal: booking.bookingDetails?.terminal || booking.customerDetails?.departureTerminal || "",
      },
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editableBooking) return;
    try {
      const payload = {
        id: editableBooking.id,
        customerDetails: editableBooking.customerDetails,
        bookingDetails: editableBooking.bookingDetails,
        instruction: editableBooking.instruction,
        services: editableBooking.services,
      };
      const response = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save booking");
      const updated = await response.json();
      setBookings((prev) => prev.map((b) => (b.id === editableBooking.id ? { ...b, ...editableBooking, ...updated } : b)));
      setSelectedBooking((prev) => (prev?.id === editableBooking.id ? { ...prev, ...editableBooking, ...updated } : prev));
      setEditing(false);
    } catch (err) {
      alert(err.message || "Unable to save booking");
    }
  };

  const handleVehicleLookup = async () => {
    if (!vehicleReg.trim()) return;
    setVehicleLookupLoading(true);
    setVehicleLookupResult(null);
    try {
      const response = await fetch(`/api/vehicle-lookup?reg=${encodeURIComponent(vehicleReg.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Lookup failed");
      setVehicleLookupResult(data);
      if (editableBooking) {
        setEditableBooking((prev) => ({
          ...prev,
          customerDetails: {
            ...prev.customerDetails,
            vehicleColor: data.color || prev.customerDetails.vehicleColor,
            make: data.make || prev.customerDetails.make,
            model: data.model || prev.customerDetails.model,
          },
        }));
      }
    } catch (err) {
      setVehicleLookupResult({ error: err.message });
    } finally {
      setVehicleLookupLoading(false);
    }
  };

  const saveControls = () => {
    localStorage.setItem("admin_refresh_interval", String(refreshInterval));
    localStorage.setItem("admin_auto_refresh", String(autoRefresh));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3" id="dashboard">
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Operations Dashboard</h1>
            <p className="text-slate-600 font-medium">Parkflow-style control for all airport meet & greet bookings.</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
              aria-label="Select date"
            />
            <button className="button primary" onClick={() => fetchBookings()} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
        {error && <div className="panel bg-red-50 text-red-700">{error}</div>}
        <div className="kpi-grid">
          <div className="kpi-card" onClick={() => setStatusFilter("all")}> 
            <p className="kpi-label">Total bookings</p>
            <p className="kpi-value">{kpi.total}</p>
          </div>
          <div className="kpi-card" onClick={() => setFlowFilter("drop")}>
            <p className="kpi-label">Drop-offs</p>
            <p className="kpi-value">{kpi.dropoffs}</p>
          </div>
          <div className="kpi-card" onClick={() => setFlowFilter("pickup")}>
            <p className="kpi-label">Pickups</p>
            <p className="kpi-value">{kpi.pickups}</p>
          </div>
          <div className="kpi-card" onClick={() => setStatusFilter("pending")}>
            <p className="kpi-label">Flights landed / pending</p>
            <p className="kpi-value">{kpi.landed}/{kpi.flights}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4" id="bookings">
        <div className="xl:col-span-2 space-y-4">
          <div className="panel space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="panel-title">Bookings</h2>
              <div className="flex gap-2 items-center text-sm text-slate-500">
                <span className="tag">Today {selectedDate}</span>
                <span className="tag">{filteredBookings.length} shown</span>
              </div>
            </div>
            <div className="filter-bar">
              <input
                className="input"
                placeholder="Search booking #, reg, or name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select className="select" value={terminalFilter} onChange={(e) => setTerminalFilter(e.target.value)}>
                <option value="all">All terminals</option>
                <option value="T1">Terminal 1</option>
                <option value="T2">Terminal 2</option>
                <option value="T3">Terminal 3</option>
                <option value="T4">Terminal 4</option>
                <option value="T5">Terminal 5</option>
              </select>
              <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All statuses</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select className="select" value={flowFilter} onChange={(e) => setFlowFilter(e.target.value)}>
                <option value="all">Drop & Pickup</option>
                <option value="drop">Drop-off</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
            <div className="overflow-auto" style={{ maxHeight: "520px" }}>
              <table className="booking-table">
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Customer</th>
                    <th>Car</th>
                    <th>Terminal</th>
                    <th>Drop-off</th>
                    <th>Pickup</th>
                    <th>Flight</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="font-bold">{booking.orderId}</td>
                      <td>{`${booking.customerDetails?.firstName || ""} ${booking.customerDetails?.lastName || ""}`}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-bold">{booking.customerDetails?.carReg || "-"}</span>
                          <span className="text-xs text-slate-500">{booking.customerDetails?.vehicleColor || booking.bookingDetails?.vehicleColor || ""}</span>
                        </div>
                      </td>
                      <td>{booking.bookingDetails?.terminal || "-"}</td>
                      <td>
                        <div className="flex flex-col">
                          <span>{booking.bookingDetails?.startDate || "-"}</span>
                          <span className="text-xs text-slate-500">{booking.bookingDetails?.startTime}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span>{booking.bookingDetails?.endDate || "-"}</span>
                          <span className="text-xs text-slate-500">{booking.bookingDetails?.endTime}</span>
                        </div>
                      </td>
                      <td>{booking.customerDetails?.flightNumber || booking.bookingDetails?.flightNumber || "-"}</td>
                      <td>
                        <span className={statusClass(booking.bookingDetails?.status)}>
                          {booking.bookingDetails?.status || "pending"}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          <button className="tag" onClick={() => setSelectedBooking(booking)}>View</button>
                          <button className="tag" onClick={() => startEdit(booking)}>Edit</button>
                          <Link className="tag" href={`/admin/bookings/${booking.id || booking.orderId}/print`} target="_blank">Print</Link>
                          <select
                            className="select"
                            value={booking.bookingDetails?.status || "pending"}
                            onChange={(e) => handleStatusChange(booking, e.target.value)}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filteredBookings.length && (
                    <tr>
                      <td colSpan="9" className="text-center py-6 text-slate-500 font-semibold">No bookings for this date</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel space-y-3" id="flights">
            <div className="flex justify-between items-center">
              <h2 className="panel-title">Flight tracking</h2>
              <p className="text-sm text-slate-500">Color codes: gray=not landed, green=landed, violet=baggage</p>
            </div>
            <div className="timeline">
              {filteredBookings
                .filter((b) => b.customerDetails?.flightNumber)
                .map((booking) => {
                  const status = booking.bookingDetails?.flightStatus || "pending";
                  return (
                    <div key={booking.id} className="timeline-card">
                      <div className="flex items-center gap-2">
                        <span className={`status-dot ${flightColor(status)}`} />
                        <p className="font-black text-slate-900">{booking.customerDetails.flightNumber}</p>
                      </div>
                      <p className="text-slate-600 text-sm font-semibold">{booking.bookingDetails?.startTime || "--:--"} arrival</p>
                      <p className="font-semibold">{booking.orderId} · {booking.customerDetails.firstName} {booking.customerDetails.lastName}</p>
                      <p className="text-sm text-slate-500">{booking.customerDetails.carReg}</p>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="tag">{status}</span>
                        <button className="tag" onClick={() => setSelectedBooking(booking)}>Open</button>
                      </div>
                    </div>
                  );
                })}
              {!filteredBookings.filter((b) => b.customerDetails?.flightNumber).length && (
                <p className="text-slate-500 font-semibold">No flights for this date.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="detail-drawer">
            <div className="flex justify-between items-center mb-2">
              <h3 className="panel-title">Booking detail</h3>
              {selectedBooking && (
                <Link className="tag" href={`/admin/bookings/${selectedBooking.id || selectedBooking.orderId}/print`} target="_blank">
                  Print page
                </Link>
              )}
            </div>
            {selectedBooking ? (
              <div className="space-y-4">
                <div className="drawer-section">
                  <div>
                    <p className="drawer-label">Booking #</p>
                    <p className="drawer-value">{selectedBooking.orderId}</p>
                  </div>
                  <div>
                    <p className="drawer-label">Status</p>
                    <p className="drawer-value capitalize">{selectedBooking.bookingDetails?.status}</p>
                  </div>
                  <div>
                    <p className="drawer-label">Terminal</p>
                    <p className="drawer-value">{selectedBooking.bookingDetails?.terminal || "-"}</p>
                  </div>
                </div>
                <div className="drawer-section">
                  <div>
                    <p className="drawer-label">Customer</p>
                    <p className="drawer-value">{selectedBooking.customerDetails?.firstName} {selectedBooking.customerDetails?.lastName}</p>
                  </div>
                  <div>
                    <p className="drawer-label">Contact</p>
                    <p className="drawer-value">{selectedBooking.customerDetails?.contactNumber}</p>
                  </div>
                  <div>
                    <p className="drawer-label">Email</p>
                    <p className="drawer-value break-all">{selectedBooking.customerDetails?.email}</p>
                  </div>
                </div>
                <div className="drawer-section">
                  <div>
                    <p className="drawer-label">Vehicle</p>
                    <p className="drawer-value">{selectedBooking.customerDetails?.carReg}</p>
                  </div>
                  <div>
                    <p className="drawer-label">Colour</p>
                    <p className="drawer-value">{selectedBooking.customerDetails?.vehicleColor || selectedBooking.bookingDetails?.vehicleColor || "-"}</p>
                  </div>
                  <div>
                    <p className="drawer-label">Services</p>
                    <p className="drawer-value text-sm">{(selectedBooking.services || []).join(", ") || "Standard"}</p>
                  </div>
                </div>
                <div className="drawer-section">
                  <div>
                    <p className="drawer-label">Drop-off</p>
                    <p className="drawer-value">{selectedBooking.bookingDetails?.startDate} {selectedBooking.bookingDetails?.startTime}</p>
                  </div>
                  <div>
                    <p className="drawer-label">Pickup</p>
                    <p className="drawer-value">{selectedBooking.bookingDetails?.endDate} {selectedBooking.bookingDetails?.endTime}</p>
                  </div>
                  <div>
                    <p className="drawer-label">Flight</p>
                    <p className="drawer-value">{selectedBooking.customerDetails?.flightNumber || "-"}</p>
                  </div>
                </div>
                <div className="drawer-section">
                  <div>
                    <p className="drawer-label">Notes</p>
                    <p className="drawer-value text-sm leading-tight">{selectedBooking.instruction || selectedBooking.customerDetails?.customerInstruction || "No notes"}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="tag" onClick={() => handleStatusChange(selectedBooking, "dropoff-complete")}>Mark drop-off</button>
                  <button className="tag" onClick={() => handleStatusChange(selectedBooking, "pickup-complete")}>Mark pickup</button>
                  <button className="tag" onClick={() => startEdit(selectedBooking)}>Edit booking</button>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Select a booking to view details.</p>
            )}
          </div>

          <div className="panel space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="panel-title">Vehicle lookup</h3>
              <span className="tag">admin-only</span>
            </div>
            <div className="flex gap-2">
              <input
                className="input"
                placeholder="Enter registration (e.g. AB12CDE)"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
              />
              <button className="button primary" onClick={handleVehicleLookup} disabled={vehicleLookupLoading}>
                {vehicleLookupLoading ? "Looking up..." : "Lookup"}
              </button>
            </div>
            {vehicleLookupResult && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                {vehicleLookupResult.error ? (
                  <p className="text-red-600 font-semibold">{vehicleLookupResult.error}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-slate-700">
                    <span>Make: {vehicleLookupResult.make || "-"}</span>
                    <span>Model: {vehicleLookupResult.model || "-"}</span>
                    <span>Color: {vehicleLookupResult.color || "-"}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="panel space-y-3" id="controls">
            <div className="flex justify-between items-center">
              <h3 className="panel-title">Admin controls</h3>
              <span className="tag">Config</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Auto refresh (seconds)</label>
              <input
                type="number"
                min={15}
                className="input"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                Auto refresh tables & flights
              </label>
              <button className="button primary" onClick={saveControls}>Save controls</button>
              <div className="text-xs text-slate-500">
                Manage status colors, API keys via environment variables, and print layout toggles. Vehicle lookup uses
                VEHICLE_LOOKUP_API_KEY and VEHICLE_LOOKUP_API_URL. Flight tracking uses FLIGHT_TRACKING_API_KEY and FLIGHT_TRACKING_API_URL.
              </div>
            </div>
          </div>
        </div>
      </div>

      {editing && editableBooking && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold">Edit booking</h3>
              <button className="tag" onClick={() => setEditing(false)}>Close</button>
            </div>
            <form onSubmit={submitEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="drawer-label">First name</label>
                  <input
                    className="input"
                    value={editableBooking.customerDetails.firstName}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, firstName: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Last name</label>
                  <input
                    className="input"
                    value={editableBooking.customerDetails.lastName}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, lastName: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Email</label>
                  <input
                    className="input"
                    value={editableBooking.customerDetails.email}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, email: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Phone</label>
                  <input
                    className="input"
                    value={editableBooking.customerDetails.contactNumber}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, contactNumber: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Car registration</label>
                  <input
                    className="input"
                    value={editableBooking.customerDetails.carReg}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, carReg: e.target.value.toUpperCase() },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Car colour</label>
                  <input
                    className="input"
                    value={editableBooking.customerDetails.vehicleColor}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, vehicleColor: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Terminal</label>
                  <input
                    className="input"
                    value={editableBooking.bookingDetails.terminal}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      bookingDetails: { ...prev.bookingDetails, terminal: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Flight number</label>
                  <input
                    className="input"
                    value={editableBooking.customerDetails.flightNumber || ""}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, flightNumber: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Drop-off date</label>
                  <input
                    type="date"
                    className="input"
                    value={editableBooking.bookingDetails.startDate || ""}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      bookingDetails: { ...prev.bookingDetails, startDate: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Drop-off time</label>
                  <input
                    type="time"
                    className="input"
                    value={editableBooking.bookingDetails.startTime || ""}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      bookingDetails: { ...prev.bookingDetails, startTime: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Pickup date</label>
                  <input
                    type="date"
                    className="input"
                    value={editableBooking.bookingDetails.endDate || ""}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      bookingDetails: { ...prev.bookingDetails, endDate: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Pickup time</label>
                  <input
                    type="time"
                    className="input"
                    value={editableBooking.bookingDetails.endTime || ""}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      bookingDetails: { ...prev.bookingDetails, endTime: e.target.value },
                    }))}
                  />
                </div>
                <div>
                  <label className="drawer-label">Status</label>
                  <select
                    className="select"
                    value={editableBooking.bookingDetails.status}
                    onChange={(e) => setEditableBooking((prev) => ({
                      ...prev,
                      bookingDetails: { ...prev.bookingDetails, status: e.target.value },
                    }))}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="drawer-label">Notes</label>
                  <textarea
                    className="input"
                    value={editableBooking.instruction || ""}
                    onChange={(e) => setEditableBooking((prev) => ({ ...prev, instruction: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="tag" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="button primary">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
