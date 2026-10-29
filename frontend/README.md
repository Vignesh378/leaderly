# Ledgerly frontend

Ledgerly is a responsive sales-transaction workspace built with React, Vite, Tailwind CSS v4, React Router, Lucide, Recharts, Axios, and React Hot Toast.

## Run locally

```sh
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api` by default. To use a different backend, create a `.env` file with:

```sh
VITE_API_URL=http://localhost:5000/api
```

The backend must be running and allow the frontend origin through CORS.

## Validate

```sh
npm run lint
npm run build
```

The dashboard and reports use the selected date range to request revenue, transaction, product, and payment summaries. Transactions can be searched and filtered, and sales can be created or deleted from the corresponding pages.
