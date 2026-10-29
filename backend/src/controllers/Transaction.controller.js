import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res, next) => {
  try {
    const {
      transactionDate,
      productName,
      category,
      quantity,
      unitPrice,
      paymentMethod,
    } = req.body;

    if (
      typeof productName !== "string" ||
      !productName.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      quantity === undefined ||
      unitPrice === undefined ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required transaction fields.",
      });
    }

    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(unitPrice);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1 ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a positive integer and price cannot be negative.",
      });
    }

    if (
      !["Cash", "UPI", "Card", "Net Banking", "Other"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    const date = transactionDate
      ? new Date(transactionDate)
      : new Date();

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction date.",
      });
    }

    const totalAmount = Number(
      (parsedQuantity * parsedPrice).toFixed(2)
    );

    const transaction = await Transaction.create({
      transactionCode: `TXN-${new mongoose.Types.ObjectId().toString()}`,
      transactionDate: date,
      productName: productName.trim(),
      category: category.trim(),
      quantity: parsedQuantity,
      unitPrice: parsedPrice,
      totalAmount,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully.",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const {
      search,
      category,
      paymentMethod,
      startDate,
      endDate,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number.parseInt(limit, 10) || 10)
    );

    const filter = {};

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { productName: { $regex: escapedSearch, $options: "i" } },
        { transactionCode: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      filter.transactionDate = {};

      if (startDate) {
        const start = new Date(startDate);

        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid startDate.",
          });
        }

        filter.transactionDate.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);

        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid endDate.",
          });
        }

        end.setUTCHours(23, 59, 59, 999);
        filter.transactionDate.$lte = end;
      }
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ transactionDate: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID.",
      });
    }

    const transaction = await Transaction.findById(req.params.id).lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID.",
      });
    }

    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};