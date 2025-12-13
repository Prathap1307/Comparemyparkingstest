import { NextRequest, NextResponse } from "next/server";
import { fetchFlightStatus } from "@/lib/flight-providers";
import { z } from "zod";

const cache = new Map<string, { expires: number; data: unknown }>();
const paramsSchema = z.object({ flightNumber: z.string().min(2), date: z.string().optional() });

export async function GET(req: NextRequest) {
  const parsed = paramsSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  const key = `${parsed.data.flightNumber}-${parsed.data.date ?? ""}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }
  const status = await fetchFlightStatus(parsed.data.flightNumber, parsed.data.date);
  cache.set(key, { data: status, expires: Date.now() + 60_000 });
  return NextResponse.json(status);
}
