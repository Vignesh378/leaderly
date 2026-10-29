
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Transaction APIs
export const getTransactions = (params = {}) =>
  api.get("/transactions", { params });

export const createTransaction = (data) =>
  api.post("/transactions", data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`);

// Analytics APIs
export const getSummary = (params = {}) =>
  api.get("/analytics/summary", { params });

export const getSalesTrend = (params = {}) =>
  api.get("/analytics/sales-trend", { params });

export const getTopProducts = (params = {}) =>
  api.get("/analytics/top-products", { params });

export const getPaymentBreakdown = (params = {}) =>
  api.get("/analytics/payment-breakdown", { params });

export default api;
