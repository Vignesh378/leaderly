# Ledgerly frontend

Ledgerly is a responsive sales-transaction workspace built with React, Vite, Tailwind CSS v4, React Router, Lucide, Recharts, Axios, and React Hot Toast.

## Run locally

```sh
npm install
npm run dev
```

For local development the frontend defaults to `http://localhost:5000/api`. For a deployed build, configure `VITE_API_URL` to the full API base URL ending in `/api`:

```sh
VITE_API_URL=https://your-api.example.com/api
```

Production builds default to `https://ledgerly-api.onrender.com/api`, matching the Render service in the repository blueprint. Set `VITE_API_URL` in the build environment if your deployed API has a different hostname. The backend must allow the exact frontend origin through `CORS_ORIGINS`.

For Vercel, set the project Root Directory to `frontend/`; `vercel.json` provides client-side routing and browser security headers. See the repository [deployment guide](../README.md) for the Render API setup.

## Validate

```sh
npm run lint
npm run build
```

The dashboard and reports use the selected date range to request revenue, transaction, product, and payment summaries. Transactions can be searched and filtered, and sales can be created or deleted from the corresponding pages.
