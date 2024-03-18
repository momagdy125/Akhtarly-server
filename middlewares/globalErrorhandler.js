const globalErrorHandler = (err, req, res, next) => {
  return handleProdError(err, res);
};
function handleValidatorErrors(err, res) {
  const errors = Object.values(err.errors).map((error) => error.message);
  res.status(400).json({ state: "Fail", message: errors });
}
function handleEmailError(res) {
  res
    .status(403)
    .json({ state: "Fail", message: "this email is already in use" });
}
function handleProdError(err, res) {
  if (err.name === "ValidationError") {
    //if the error from schema
    return handleValidatorErrors(err, res);
  }
  //if the error from email duplication
  if (err.code === 11000 && err.keyPattern && err.keyPattern.email)
    return handleEmailError(res);
  // For other types of errors, send a general error response
  else {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
      state: "Fail",
    });
  }
}

module.exports = globalErrorHandler;
