# Ledgerly

Ledgerly is a React/Vite sales dashboard backed by an Express API and MongoDB.

## Local development

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.
2. Copy `frontend/.env.example` to `frontend/.env.local`.
3. In separate terminals, run `npm ci && npm run dev` from `backend/` and `frontend/`.

The backend listens on port 5000 by default. Frontend API URLs must end in `/api`.

## Deploy

### API on Render

1. Create a Render Blueprint from this repository using `render.yaml`. The blueprint uses a paid Starter instance to avoid free-instance spin-down; review Render's current pricing before deploying.
2. Set the secret `MONGODB_URI` in the Render dashboard. Use MongoDB Atlas or another persistent MongoDB service; do not rely on the local `backend/data/` directory.
3. Set `CORS_ORIGINS` to the exact Vercel origin, for example `https://your-app.vercel.app`. Multiple origins may be comma-separated. Do not use `*`.
4. Configure MongoDB network access to allow the Render service to connect. Prefer private networking or a restricted allowlist where available.

Render checks `/api/health`; it returns `503` until MongoDB is connected.

### Frontend on Vercel

1. Import the repository and set the Vercel project Root Directory to `frontend/`.
2. Set the build environment variable `VITE_API_URL` to the Render API URL ending in `/api`, for example `https://your-api.onrender.com/api`.
3. Add the final Vercel domain to the API's `CORS_ORIGINS`.

`frontend/vercel.json` configures client-side routing and browser security headers. `VITE_API_URL` is embedded in the frontend build, so rebuild after changing it.

## Production access warning

Sign-in is not implemented. CORS is a browser policy, not authentication; anyone who can reach the API can read, create, and delete transactions. Do not expose this deployment to untrusted users or sensitive business data until sign-in/authorization or platform-level access controls are in place.

## Validation

Run `npm run lint` and `npm run build` in `frontend/`. Run `npm audit --omit=dev` in both `frontend/` and `backend/`.
