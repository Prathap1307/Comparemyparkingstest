import { z } from "zod";

const responseSchema = z.object({
  status: z.string(),
  departureAirport: z.string().optional(),
  arrivalAirport: z.string().optional(),
  scheduledDeparture: z.string().optional(),
  estimatedDeparture: z.string().optional(),
  actualDeparture: z.string().optional(),
  scheduledArrival: z.string().optional(),
  estimatedArrival: z.string().optional(),
  actualArrival: z.string().optional(),
  terminal: z.string().optional(),
  gate: z.string().optional(),
  lastUpdated: z.string().optional(),
});

export type FlightStatus = z.infer<typeof responseSchema>;

async function fetchOpenSky(flightNumber: string) {
  const url = `${process.env.FLIGHT_TRACK_BASE_URL ?? "https://opensky-network.org/api"}/flights?icao24=${flightNumber}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("OpenSky request failed");
  const data = await res.json();
  return responseSchema.parse({
    status: data[0]?.status ?? "unknown",
    departureAirport: data[0]?.estDepartureAirport,
    arrivalAirport: data[0]?.estArrivalAirport,
    lastUpdated: new Date().toISOString(),
  });
}

async function fetchAviationStack(flightNumber: string) {
  const url = `${process.env.FLIGHT_TRACK_BASE_URL ?? "http://api.aviationstack.com/v1"}/flights?access_key=${process.env.FLIGHT_TRACK_API_KEY}&flight_iata=${flightNumber}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("aviationstack request failed");
  const json = await res.json();
  const first = json.data?.[0];
  return responseSchema.parse({
    status: first?.flight_status ?? "unknown",
    departureAirport: first?.departure?.airport,
    arrivalAirport: first?.arrival?.airport,
    scheduledDeparture: first?.departure?.scheduled,
    estimatedDeparture: first?.departure?.estimated,
    actualDeparture: first?.departure?.actual,
    scheduledArrival: first?.arrival?.scheduled,
    estimatedArrival: first?.arrival?.estimated,
    actualArrival: first?.arrival?.actual,
    terminal: first?.arrival?.terminal,
    gate: first?.arrival?.gate,
    lastUpdated: new Date().toISOString(),
  });
}

export async function fetchFlightStatus(flightNumber: string, date?: string): Promise<FlightStatus> {
  const provider = (process.env.FLIGHT_TRACK_PROVIDER ?? "opensky").toLowerCase();
  if (provider === "aviationstack") {
    return fetchAviationStack(flightNumber);
  }
  return fetchOpenSky(flightNumber);
}
