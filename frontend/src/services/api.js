
import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : undefined);

if (!apiBaseUrl) {
  throw new Error("VITE_API_URL must be configured for production builds.");
}

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
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
