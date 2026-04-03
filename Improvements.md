# Improvements

## 1. Security fix: removed guest data exposure from map API

- Updated `GET /api/map` to return only cabana coordinates in `bookedCabanas`.
- The API no longer exposes guest name and room number in the public map payload.

## 2. Backend architecture improvements

- Extracted booking and validation logic from route handlers into `backend/src/bookingService.ts`.
- Added explicit request parsing/validation (`parseBookingRequest`) with consistent API errors.
- Added a focused booking operation (`reserveCabana`) to keep route handlers thin and easier to maintain/test.
- Added centralized error handling for expected API errors vs unexpected failures.

## 3. Frontend dead code cleanup in tile placement

- Removed unused chalet-neighbor calculations in `ResortMap` path rendering.
- Kept the existing behavior (north-side chalet path connection) while simplifying logic.

## 4. Contract and tests updates

- Updated frontend map contract/types to consume `bookedCabanas: string[]` directly.
- Updated backend tests to validate:
  - Booked cabanas are returned as coordinates only.
  - Guest reservation details are not exposed via `/api/map`.
  - Invalid non-integer coordinates are rejected.