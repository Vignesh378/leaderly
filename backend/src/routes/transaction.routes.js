import express from "express";
import { writeRateLimiter } from "../middleware/apiRateLimiter.js";

import {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
} from "../controllers/Transaction.controller.js";

const router = express.Router();

router.post("/", writeRateLimiter, createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.delete("/:id", writeRateLimiter, deleteTransaction);

export default router;