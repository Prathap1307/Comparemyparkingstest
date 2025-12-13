import { fetchFromAviationStack } from "./aviationstack";
import { fetchFromOpenSky } from "./opensky";
import { FlightEndpointConfig, FlightStatus } from "./types";

const cache = new Map<string, { expires: number; data: FlightStatus }>();

function getCacheKey(flightNumber: string) {
  return flightNumber.toUpperCase();
}

async function fetchLiveStatus(flightNumber: string, config: FlightEndpointConfig): Promise<FlightStatus> {
  if (config.provider === "aviationstack") {
    return fetchFromAviationStack(flightNumber, config.baseUrl, config.apiKey);
  }
  return fetchFromOpenSky(flightNumber, config.baseUrl);
}

export async function fetchFlightStatus(flightNumber: string): Promise<FlightStatus> {
  const provider = (process.env.FLIGHT_TRACK_PROVIDER ?? "opensky").toLowerCase() as FlightEndpointConfig["provider"];
  const config: FlightEndpointConfig = {
    provider,
    baseUrl: process.env.FLIGHT_TRACK_BASE_URL,
    apiKey: process.env.FLIGHT_TRACK_API_KEY,
  };

  const cacheKey = getCacheKey(flightNumber);
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expires > now) {
    return cached.data;
  }

  const data = await fetchLiveStatus(flightNumber, config);
  cache.set(cacheKey, { data, expires: now + 90_000 });
  return data;
}
