import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000,
  });

  console.info("MongoDB connected.");
};

export default connectDB;