# Resort Map Booking System

A full-stack web application designed for visualizing a resort map and managing cabana reservations. Built with React, Node.js (Express), and TypeScript.

---

## Quick Start

This project is structured as a monorepo containing both the frontend and backend.

**1. Install all dependencies (Root, Frontend, Backend):**

```
npm run install:all
```

**2. Start both servers simultaneously:**

```
npm run start
```

The starting command fully accepts custom paths for the map and bookings files. Following standard NPM conventions, use the -- separator to pass your arguments to the underlying script:

```
npm run start -- --map <path> --bookings <path>
```

If your npm version warns about unknown CLI configs for custom flags, use positional arguments instead:

```
npm run start -- <path-to-map> <path-to-bookings>
```

Behavior:

- If no flags are provided, backend uses default files from the working directory: `map.ascii` and `bookings.json`.
- If flags are provided, backend uses the given paths.

Example:

```
npm run start -- --map ./map.ascii --bookings ./bookings.json
```

Single-option examples:

```
npm run start -- --map ./map.ascii
npm run start -- --bookings ./bookings.json
```

The application will be available at:

Frontend: http://localhost:5173

Backend API: http://localhost:3000

Frontend API base URL is configurable with `VITE_API_URL` (defaults to `http://localhost:3000/api`).

---

## Using the app

**1. Browse the Map: open the frontend URL (http://localhost:5173 by default). You will see the resort map rendered based on the data.**

**2. Check Availability: available cabanas have a pointer cursor and have a green background. Booked cabanas are unclickable and have a red background**

**3. Book a Cabana: click on an available cabana. A modal will appear.**

**4. Validation: enter a valid room number and guest name (e.g., Room: 101, Name: Alice Smith). If the credentials match the records, the booking is confirmed, the modal closes, and the map immediately updates to reflect the new state.**

---

## Testing

This project includes simple test suites for both the backend (API tests) and frontend (UI/Component tests).

To run all tests sequentially (backend first, then frontend):

```
npm run test
```

---

## Design decisions and trade-offs:

- Tailwind for styling: chosen for the ease of development.

- Native fetch & useEffect (no React Query): while I would normally use React Query, because it is better than setting state in a useEffect (which is an anti-pattern), bringing it in for essentially one or two simple API calls would be over-engineering. Native fetch combined with React's local state is ok for this scope and keeps the dependencies list short.

- Separation of API logic (api.ts): network requests were extracted from React components into a dedicated api.ts file. This enforces separation of concerns - components only care about rendering data and handling user interactions, not the implementation details of data fetching.

- Custom booking modal: built entirely from scratch rather than installing a bulky UI component library. This keeps the bundle size absolutely minimal.

- Tests in the same folder as components: Test files are placed directly alongside their respective implementation files (e.g., ResortMap.test.tsx next to ResortMap.tsx) rather than in a disconnected **tests** or directory. For a project of this scale this is also ok.

- Centralized frontend types file: all types are kept in a single types.ts file rather than being scattered or defined inline across components. This makes it easier to debug and easier to develop the app.

- Minimal asset footprint: Skipped purely cosmetic changes, such as replacing the default Vite favicon. Adding extra static assets that don't contribute to the core business logic (the map visualization and booking flow) was intentionally avoided to stay strictly focused on the core requirements.

- Functions placed in component files: the utility functions are placed in the component files that are using them directly. Decided that placing them this way would be better than creating a utils.ts file, as the number of the functions is really small. Creating an utils.ts file would be better for seperation of concerns and later development, but for a project this size, the current approach is sufficient.

- No express router: I decided to put all of the backend logic (besides state) in the index.js file instead of creating a seperate routes and controllers folders and files. For a project this size (with 2 API methods) this would be an overkill.

- No centralized backend types file: as there are very little types in the backend, there is no need for a types.ts file for the backend. What could be done is a single types.ts file for both the frontend and backend, but this is just one way to do that.

