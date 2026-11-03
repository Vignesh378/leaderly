import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";
import { apiRateLimiter } from "./middleware/apiRateLimiter.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = (process.env.CORS_ORIGINS || (isProduction ? "" : "http://localhost:5173"))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (isProduction && allowedOrigins.length === 0) {
  throw new Error("CORS_ORIGINS must contain at least one frontend origin in production.");
}

for (const origin of allowedOrigins) {
  let parsedOrigin;

  try {
    parsedOrigin = new URL(origin);
  } catch {
    throw new Error(`Invalid frontend origin in CORS_ORIGINS: ${origin}`);
  }

  if (
    !["http:", "https:"].includes(parsedOrigin.protocol) ||
    parsedOrigin.origin !== origin ||
    (isProduction && parsedOrigin.protocol !== "https:")
  ) {
    throw new Error(`CORS_ORIGINS entries must be exact secure origins in production: ${origin}`);
  }
}

app.disable("x-powered-by");
app.set("trust proxy", isProduction ? 1 : false);
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error("Origin is not allowed by CORS.");
      error.status = 403;
      return callback(error);
    },
  })
);

app.use(express.json({ limit: "16kb" }));

app.use("/api", apiRateLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Sales Transaction Logger API",
  });
});

app.get("/api/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;

  res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    status: databaseReady ? "ok" : "unavailable",
  });
});

app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use(errorHandler);

export default app;