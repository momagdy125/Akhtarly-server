const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.name === "ValidationError") {
    // If the error is a ValidationError
    const errorMessages = {};
    for (let field in err.errors) {
      errorMessages[field] = err.errors[field].message;
    }
    response.status(400).json({
      message: "error",
      details: errorMessages, // Sending all validation error messages
    });
  } else {
    res.status(err.statusCode).json({
      message: err.message,
      state: "Fail",
    });
  }
};
module.exports = globalErrorHandler;
