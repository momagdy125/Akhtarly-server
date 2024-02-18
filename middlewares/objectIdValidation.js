const mongoose = require("mongoose");
const apiError = require("../Utils/apiError");

exports.listOfObjectIdValidation = (req, res, next) => {
  if (!req.body.programList) {
    next(new apiError("Missing 'programList' field", 400));
  }
  const programList = req.body.programList;

  // Check if programList is an array
  if (!Array.isArray(programList)) {
    return next(new apiError("Programs should be provided as an array.", 400));
  }

  // Check if each element in the programList is a valid ObjectId
  for (let objectId of programList) {
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      return next(new apiError(`${objectId} is not a valid ObjectId.`, 400));
    }
  }

  // If validation passes, continue with the next middleware
  next();
};
