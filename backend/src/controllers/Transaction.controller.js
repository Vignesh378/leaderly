import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Net Banking", "Other"];
const MAX_PAGE_SIZE = 100;

const parsePositiveInteger = (value, defaultValue) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
};

export const createTransaction = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object.",
      });
    }

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
      productName.trim().length > 120 ||
      typeof category !== "string" ||
      !category.trim() ||
      category.trim().length > 60 ||
      quantity === undefined ||
      unitPrice === undefined ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required transaction fields.",
      });
    }

    const isNumericInput = (value) =>
      typeof value === "number" ||
      (typeof value === "string" && value.trim() !== "");
    const parsedQuantity = isNumericInput(quantity)
      ? Number(quantity)
      : Number.NaN;
    const parsedPrice = isNumericInput(unitPrice)
      ? Number(unitPrice)
      : Number.NaN;

    if (
      !Number.isSafeInteger(parsedQuantity) ||
      parsedQuantity < 1 ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a positive safe integer and price cannot be negative.",
      });
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
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

    const unroundedTotal = parsedQuantity * parsedPrice;

    if (!Number.isFinite(unroundedTotal) || unroundedTotal >= 1e21) {
      return res.status(400).json({
        success: false,
        message: "Transaction total is out of range.",
      });
    }

    const totalAmount = Number(unroundedTotal.toFixed(2));

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

    const pageNumber = parsePositiveInteger(page, 1);
    const pageSize = parsePositiveInteger(limit, 10);

    if (
      pageNumber === null ||
      pageSize === null ||
      pageSize > MAX_PAGE_SIZE ||
      !Number.isSafeInteger((pageNumber - 1) * pageSize)
    ) {
      return res.status(400).json({
        success: false,
        message: `page must be a positive safe integer and limit must be between 1 and ${MAX_PAGE_SIZE}.`,
      });
    }

    if (
      (search !== undefined &&
        (typeof search !== "string" || search.length > 100)) ||
      (category !== undefined &&
        (typeof category !== "string" || category.length > 60)) ||
      (paymentMethod !== undefined &&
        (typeof paymentMethod !== "string" ||
          !PAYMENT_METHODS.includes(paymentMethod)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid search or filter parameters.",
      });
    }

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

      if (
        filter.transactionDate.$gte &&
        filter.transactionDate.$lte &&
        filter.transactionDate.$gte > filter.transactionDate.$lte
      ) {
        return res.status(400).json({
          success: false,
          message: "startDate must be before endDate.",
        });
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