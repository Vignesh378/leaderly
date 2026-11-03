import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/database.js";
import mongoose from "mongoose";

const DEFAULT_PORT = 5000;

let server;
let shuttingDown = false;

const shutdown = (signal) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.info(`Received ${signal}; shutting down.`);

  const forceExit = setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(async (error) => {
    clearTimeout(forceExit);

    if (error) {
      console.error("HTTP server shutdown failed:", error);
      process.exitCode = 1;
    }

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error("MongoDB shutdown failed:", disconnectError);
      process.exitCode = 1;
    }
  });
};

const startServer = async () => {
  try {
    await connectDB();

    const port = Number(process.env.PORT ?? DEFAULT_PORT);

    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
      throw new Error("PORT must be an integer between 1 and 65535.");
    }

    server = app.listen(port, () => {
      console.info(`API listening on port ${port}.`);
    });

    server.on("error", (error) => {
      console.error("HTTP server failed:", error);
      process.exitCode = 1;
    });

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("API startup failed:", error);

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error("MongoDB cleanup after startup failure failed:", disconnectError);
    }

    process.exitCode = 1;
  }
};

startServer();