
import {
  getSummary,
  getSalesTrend,
  getTopProducts,
  getPaymentBreakdown,
} from "../services/analytics.service.js";

const getDateParams = (req) => ({
  startDate: req.query.startDate,
  endDate: req.query.endDate,
});

export const summary = async (req, res, next) => {
  try {
    const { startDate, endDate } = getDateParams(req);
    const data = await getSummary(startDate, endDate);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.message.startsWith("Invalid ") ||
        error.message.startsWith("startDate")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

export const salesTrend = async (req, res, next) => {
  try {
    const { startDate, endDate } = getDateParams(req);
    const data = await getSalesTrend(startDate, endDate);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.message.startsWith("Invalid ") ||
        error.message.startsWith("startDate")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

export const topProducts = async (req, res, next) => {
  try {
    const { startDate, endDate } = getDateParams(req);

    const requestedLimit = Number(req.query.limit ?? 5);

    if (
      !Number.isInteger(requestedLimit) ||
      requestedLimit < 1 ||
      requestedLimit > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "limit must be an integer between 1 and 50.",
      });
    }

    const data = await getTopProducts(
      startDate,
      endDate,
      requestedLimit
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.message.startsWith("Invalid ") ||
        error.message.startsWith("startDate")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

export const paymentBreakdown = async (req, res, next) => {
  try {
    const { startDate, endDate } = getDateParams(req);
    const data = await getPaymentBreakdown(startDate, endDate);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.message.startsWith("Invalid ") ||
        error.message.startsWith("startDate")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};
