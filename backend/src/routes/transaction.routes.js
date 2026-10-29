import express from "express";

import {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
} from "../controllers/Transaction.controller.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.delete("/:id", deleteTransaction);

export default router;