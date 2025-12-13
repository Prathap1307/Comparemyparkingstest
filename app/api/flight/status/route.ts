import { NextRequest, NextResponse } from "next/server";
import { fetchFlightStatus } from "@/lib/flight-providers";
import { z } from "zod";

const paramsSchema = z.object({ flightNumber: z.string().min(2) });

export async function GET(req: NextRequest) {
  const parsed = paramsSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid params" }, { status: 400 });

  const status = await fetchFlightStatus(parsed.data.flightNumber);
  return NextResponse.json(status);
}
