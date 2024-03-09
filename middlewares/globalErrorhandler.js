const globalErrorHandler = (err, req, res, next) => {
  //if the error from schema
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ state: "Fail", errors });
  }
  //if the error from email duplication
  else if (err.code === 11000 && err.keyPattern && err.keyPattern.email)
    return res  
      .status(403)
      .json({ state: "Fail", message: "this email is already in use" });
  // For other types of errors, send a general error response
  else {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
      state: "Fail",
    });
  }
};
module.exports = globalErrorHandler;
