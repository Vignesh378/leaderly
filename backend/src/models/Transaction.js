import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    transactionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer.",
      },
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "UPI", "Card", "Net Banking", "Other"],
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ transactionDate: -1 });
transactionSchema.index({ productName: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;