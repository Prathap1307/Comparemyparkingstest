import { NextResponse } from "next/server";

const VEHICLE_LOOKUP_API_URL = process.env.VEHICLE_LOOKUP_API_URL;
const VEHICLE_LOOKUP_API_KEY = process.env.VEHICLE_LOOKUP_API_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reg = searchParams.get("reg");

  if (!reg) {
    return NextResponse.json({ error: "Registration is required" }, { status: 400 });
  }

  if (!VEHICLE_LOOKUP_API_URL) {
    return NextResponse.json(
      { error: "VEHICLE_LOOKUP_API_URL is not configured. Add VEHICLE_LOOKUP_API_URL and VEHICLE_LOOKUP_API_KEY in env." },
      { status: 503 }
    );
  }

  try {
    const url = `${VEHICLE_LOOKUP_API_URL}?reg=${encodeURIComponent(reg)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: VEHICLE_LOOKUP_API_KEY ? `Bearer ${VEHICLE_LOOKUP_API_KEY}` : undefined,
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Vehicle lookup failed");
    }

    const data = await response.json();
    return NextResponse.json({
      make: data.make || data.Make || data.vehicle_make,
      model: data.model || data.Model || data.vehicle_model,
      color: data.color || data.Colour || data.vehicle_colour,
      raw: data,
    });
  } catch (err) {
    console.error("Vehicle lookup error", err);
    return NextResponse.json({ error: err.message || "Lookup failed" }, { status: 502 });
  }
}
