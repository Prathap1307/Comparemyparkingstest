import { NextResponse } from "next/server";

const FLIGHT_TRACKING_API_URL = process.env.FLIGHT_TRACKING_API_URL;
const FLIGHT_TRACKING_API_KEY = process.env.FLIGHT_TRACKING_API_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get("flightNumber");

  if (!flightNumber) {
    return NextResponse.json({ error: "flightNumber is required" }, { status: 400 });
  }

  if (!FLIGHT_TRACKING_API_URL) {
    return NextResponse.json(
      { error: "FLIGHT_TRACKING_API_URL is not configured. Add FLIGHT_TRACKING_API_URL and FLIGHT_TRACKING_API_KEY in env." },
      { status: 503 }
    );
  }

  try {
    const url = `${FLIGHT_TRACKING_API_URL}?flightNumber=${encodeURIComponent(flightNumber)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: FLIGHT_TRACKING_API_KEY ? `Bearer ${FLIGHT_TRACKING_API_KEY}` : undefined,
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Flight status request failed");
    }

    const data = await response.json();
    return NextResponse.json({
      status: data.status || data.flight_status || "unknown",
      eta: data.estimatedArrival || data.eta || null,
      gate: data.gate || null,
      raw: data,
    });
  } catch (err) {
    console.error("Flight tracking error", err);
    return NextResponse.json({ error: err.message || "Unable to fetch flight" }, { status: 502 });
  }
}
