export interface FlightEndpointConfig {
  provider: "opensky" | "aviationstack";
  apiKey?: string;
  baseUrl?: string;
}

export interface FlightStatusLeg {
  airport?: string;
  scheduled?: string;
  estimated?: string;
  actual?: string;
  terminal?: string;
  gate?: string;
}

export interface FlightStatus {
  flightNumber: string;
  status: string;
  departure: FlightStatusLeg;
  arrival: FlightStatusLeg;
  delayMinutes?: number;
  provider: string;
  lastUpdated: string;
}
