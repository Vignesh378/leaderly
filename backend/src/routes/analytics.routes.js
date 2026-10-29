
import express from "express";

import {
  summary,
  salesTrend,
  topProducts,
  paymentBreakdown,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/summary", summary);
router.get("/sales-trend", salesTrend);
router.get("/top-products", topProducts);
router.get("/payment-breakdown", paymentBreakdown);

export default router;
