const gpuModel = require("../models/gpuModel");
const apiError = require("../Utils/apiError");
const {
  RemovingFieldsFromQuery,
  querySupportComparisons,
  querySupportSubstring,
  pagination,
} = require("../Utils/queryProcesses");

exports.getAllGpus = (request, response, next) => {
  var Query = querySupportComparisons(request.query);
  Query = querySupportSubstring(Query, "Model");
  Query = RemovingFieldsFromQuery(Query, ["limit", "sort", "page"]);
  const DefaultLimit = pagination(request);

  gpuModel
    .find(Query, { __v: false })
    .sort(request.query.sort)
    .limit(request.query.limit)
    .skip((request.query.page - 1) * DefaultLimit)
    .then((Gpus) => {
      response.json({
        state: "success",
        length: Gpus.length,
        result: Gpus,
      });
    })
    .catch((error) => {
      next(new apiError(error.message, 404));
    });
};
exports.createGpu = (request, response, next) => {
  gpuModel
    .create(request.body)
    .then((Gpu) => {
      response.json({ state: "success", Gpu });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        // If it is, pass it to the next middleware (global error handler)
        return next(error);
      }
      return next(new apiError(error.message, 400));
    });
};

exports.editGpu = (request, response, next) => {
  gpuModel
    .findByIdAndUpdate(request.params.id, request.body, {
      runValidators: true,
      new: true,
    })
    .then((updatedGpu) => {
      response.status(201).json({
        state: "success",
        updatedGpu,
      });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};
exports.deleteGpu = (request, response, next) => {
  gpuModel
    .findByIdAndDelete(request.params.id, { new: true })
    .then((Gpu) => {
      response.status(200).json({ state: "success", DeletedGpu: Gpu });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};
