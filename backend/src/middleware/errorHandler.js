const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const isProduction = process.env.NODE_ENV === "production";
  const isMalformedJson = err instanceof SyntaxError && "body" in err;
  const requestedStatus =
    isMalformedJson || err.name === "ValidationError"
      ? 400
      : err.name === "CastError"
        ? 400
        : err.code === 11000
          ? 409
          : err.status || err.statusCode || 500;
  const status =
    Number.isInteger(requestedStatus) && requestedStatus >= 400 && requestedStatus <= 599
      ? requestedStatus
      : 500;

  console.error(
    JSON.stringify({
      level: "error",
      method: req.method,
      path: req.path,
      status,
      message: err.message,
      ...(isProduction ? {} : { stack: err.stack }),
    })
  );

  return res.status(status).json({
    success: false,
    message:
      status === 409
        ? "A record with that unique value already exists."
        : status >= 500 && isProduction
          ? "Internal server error"
          : isMalformedJson
            ? "Request body must contain valid JSON."
            : err.message || "Internal server error",
  });
};

export default errorHandler;