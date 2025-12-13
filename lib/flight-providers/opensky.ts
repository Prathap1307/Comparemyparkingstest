import { FlightStatus } from "./types";

export async function fetchFromOpenSky(flightNumber: string, baseUrl?: string): Promise<FlightStatus> {
  const url = `${baseUrl ?? "https://opensky-network.org/api"}/flights?icao24=${flightNumber}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`OpenSky request failed with status ${res.status}`);
  }
  const data = await res.json();
  const first = data?.[0] ?? {};
  return {
    flightNumber,
    status: first.status ?? "unknown",
    provider: "opensky",
    departure: {
      airport: first.estDepartureAirport,
      estimated: first.lastSeen ? new Date(first.lastSeen * 1000).toISOString() : undefined,
    },
    arrival: {
      airport: first.estArrivalAirport,
      estimated: first.firstSeen ? new Date(first.firstSeen * 1000).toISOString() : undefined,
    },
    lastUpdated: new Date().toISOString(),
  };
}
