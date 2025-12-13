import { FlightStatus } from "./types";

export async function fetchFromAviationStack(flightNumber: string, baseUrl?: string, apiKey?: string): Promise<FlightStatus> {
  if (!apiKey) {
    throw new Error("Aviationstack requires FLIGHT_TRACK_API_KEY");
  }
  const url = `${baseUrl ?? "http://api.aviationstack.com/v1"}/flights?access_key=${apiKey}&flight_iata=${flightNumber}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Aviationstack request failed with status ${res.status}`);
  }
  const json = await res.json();
  const first = json.data?.[0] ?? {};
  const delay = first.departure?.delay ?? first.arrival?.delay;
  return {
    flightNumber,
    status: first.flight_status ?? "unknown",
    provider: "aviationstack",
    departure: {
      airport: first.departure?.airport,
      scheduled: first.departure?.scheduled,
      estimated: first.departure?.estimated,
      actual: first.departure?.actual,
      gate: first.departure?.gate,
      terminal: first.departure?.terminal,
    },
    arrival: {
      airport: first.arrival?.airport,
      scheduled: first.arrival?.scheduled,
      estimated: first.arrival?.estimated,
      actual: first.arrival?.actual,
      gate: first.arrival?.gate,
      terminal: first.arrival?.terminal,
    },
    delayMinutes: typeof delay === "number" ? delay : undefined,
    lastUpdated: new Date().toISOString(),
  };
}
