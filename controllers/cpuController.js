const cpuModel = require("../models/cpuModel");
const apiError = require("../Utils/apiError");
const {
  RemovingFieldsFromQuery,
  querySupportComparisons,
  querySupportSubstring,
  pagination,
} = require("../Utils/queryProcesses");

exports.getAllCpus = (request, response, next) => {
  var Query = querySupportComparisons(request.query);
  Query = querySupportSubstring(Query);
  Query = RemovingFieldsFromQuery(Query, ["limit", "sort", "page"]);

  const DefaultLimit = pagination(request);

  cpuModel
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
exports.createCpu = (request, response, next) => {
  cpuModel
    .create(request.body)
    .then((cpu) => {
      response.json({ state: "success", cpu });
    })
    .catch((error) => {
      next(new apiError(error.message, 400));
    });
};

exports.editCpu = (request, response, next) => {
  cpuModel
    .findByIdAndUpdate(request.params.id, request.body, {
      runValidators: true,
      new: true,
    })
    .then((updatedCpu) => {
      response.status(201).json({
        state: "success",
        updatedCpu,
      });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};
exports.deleteCpu = (request, response, next) => {
  cpuModel
    .findByIdAndDelete(request.params.id, { new: true })
    .then((cpu) => {
      response.status(200).json({ state: "success", DeletedCpu: cpu });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};
