import mongoose from "mongoose";

let pendingConnection;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!pendingConnection) {
    pendingConnection = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10_000,
      })
      .then(() => {
        console.info("MongoDB connected.");
      });
  }

  const connection = pendingConnection;

  try {
    await connection;
  } finally {
    if (pendingConnection === connection) {
      pendingConnection = undefined;
    }
  }
};

export default connectDB;