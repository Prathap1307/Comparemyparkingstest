# CompareMyPrking.co.uk

Production-ready Next.js 15 App Router SaaS for airport parking operations with ParkFlow-inspired admin UX.

## Getting started

1. Ensure environment variables are set:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/comparemyparking
MAIN_ADMIN_ID=admin@comparemyprking.co.uk
MAIN_ADMIN_PASSWORD=ChangeMe123!
NEXTAUTH_SECRET=changeme
FLIGHT_TRACK_PROVIDER=opensky
FLIGHT_TRACK_API_KEY=demo
FLIGHT_TRACK_BASE_URL=https://opensky-network.org/api
```

2. Install dependencies and generate the Prisma client:

```
npm install
npx prisma migrate dev --name init
npm run seed
```

3. Run the app:

```
npm run dev
```

## Features
- Admin dashboard with KPI cards, command palette, and fast booking workflow controls.
- Booking CRUD with server actions, voucher print layout, and vehicle check-in sheet.
- Role-based access control seeded from environment bootstrapped main admin.
- Flight status API with provider adapters (OpenSky / aviationstack) and response caching.
- Public booking flow with SEO-ready pages and structured data placeholders.
- Tailwind + server components by default; minimal client islands where needed.

## Tests

```
npm test
```
