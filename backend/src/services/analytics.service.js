
import Transaction from "../models/Transaction.js";

const getDateFilter = (startDate, endDate) => {
  const filter = {};

  if (startDate || endDate) {
    filter.transactionDate = {};

    if (startDate) {
      const start = new Date(startDate);

      if (Number.isNaN(start.getTime())) {
        throw new Error("Invalid startDate.");
      }

      start.setUTCHours(0, 0, 0, 0);
      filter.transactionDate.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);

      if (Number.isNaN(end.getTime())) {
        throw new Error("Invalid endDate.");
      }

      end.setUTCHours(23, 59, 59, 999);
      filter.transactionDate.$lte = end;
    }

    if (
      startDate &&
      endDate &&
      filter.transactionDate.$gte > filter.transactionDate.$lte
    ) {
      throw new Error("startDate must be before endDate.");
    }
  }

  return filter;
};

export const getSummary = async (startDate, endDate) => {
  const match = getDateFilter(startDate, endDate);

  const [result] = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalTransactions: { $sum: 1 },
        totalUnitsSold: { $sum: "$quantity" },
        averageTransactionValue: { $avg: "$totalAmount" },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: { $round: ["$totalRevenue", 2] },
        totalTransactions: 1,
        totalUnitsSold: 1,
        averageTransactionValue: {
          $round: ["$averageTransactionValue", 2],
        },
      },
    },
  ]);

  return (
    result || {
      totalRevenue: 0,
      totalTransactions: 0,
      totalUnitsSold: 0,
      averageTransactionValue: 0,
    }
  );
};

export const getSalesTrend = async (startDate, endDate) => {
  const match = getDateFilter(startDate, endDate);

  return Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$transactionDate",
            timezone: "Asia/Kolkata",
          },
        },
        revenue: { $sum: "$totalAmount" },
        transactions: { $sum: 1 },
        unitsSold: { $sum: "$quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: { $round: ["$revenue", 2] },
        transactions: 1,
        unitsSold: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);
};

export const getTopProducts = async (
  startDate,
  endDate,
  limit = 5
) => {
  const match = getDateFilter(startDate, endDate);

  return Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$productName",
        unitsSold: { $sum: "$quantity" },
        revenue: { $sum: "$totalAmount" },
        transactions: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        productName: "$_id",
        unitsSold: 1,
        revenue: { $round: ["$revenue", 2] },
        transactions: 1,
      },
    },
    { $sort: { unitsSold: -1, revenue: -1 } },
    { $limit: limit },
  ]);
};

export const getPaymentBreakdown = async (startDate, endDate) => {
  const match = getDateFilter(startDate, endDate);

  return Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$paymentMethod",
        revenue: { $sum: "$totalAmount" },
        transactions: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        paymentMethod: "$_id",
        revenue: { $round: ["$revenue", 2] },
        transactions: 1,
      },
    },
    { $sort: { revenue: -1 } },
  ]);
};
