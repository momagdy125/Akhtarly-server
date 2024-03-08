const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ state: "Fail", errors });
  } else {
    // For other types of errors, send a general error response
    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
      state: "Fail",
    });
  }
};
module.exports = globalErrorHandler;
