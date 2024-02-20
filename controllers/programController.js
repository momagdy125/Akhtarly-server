const programModel = require("../models/programModel");
const cpuModel = require("../models/cpuModel");
const gpuModel = require("../models/gpuModel");
const apiError = require("../Utils/apiError");

const {
  RemovingFieldsFromQuery,
  querySupportComparisons,
  querySupportSubstring,
  pagination,
} = require("../Utils/queryProcesses");

exports.getAllPrograms = (request, response, next) => {
  var Query = querySupportComparisons(request.query);
  Query = querySupportSubstring(Query, "Software_Game");
  Query = RemovingFieldsFromQuery(Query, ["limit", "sort", "page"]);

  const DefaultLimit = pagination(request);
  programModel
    .find(Query, { __v: false })
    .sort(request.query.sort)
    .limit(request.query.limit)
    .skip((request.query.page - 1) * DefaultLimit)
    .then((programs) => {
      response.json({
        state: "success",
        length: programs.length,
        result: programs,
      });
    })
    .catch((error) => {
      next(new apiError(error.message, 404));
    });
};
exports.createProgram = (request, response, next) => {
  programModel
    .create(request.body)
    .then((program) => {
      response.json({ state: "success", program });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        // If it is, pass it to the next middleware (global error handler)
        return next(error);
      }
      return next(new apiError(error.message, 400));
    });
};

exports.editProgram = (request, response, next) => {
  programModel
    .findByIdAndUpdate(request.params.id, request.body, {
      runValidators: true,
      new: true,
    })
    .then((updatedProgram) => {
      response.status(201).json({
        state: "success",
        updatedProgram,
      });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};
exports.deleteProgram = (request, response, next) => {
  programModel
    .findByIdAndDelete(request.params.id, { new: true })
    .then((Program) => {
      response.status(200).json({ state: "success", DeletedProgram: Program });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};

exports.sendPrograms = async (request, response, next) => {
  try {
    const programList = request.body.programList;

    // Search for programs and extract CPU Model names
    const programs = await programModel
      .find({ _id: { $in: programList } })
      .select("MinCPU MinGPU");

    const minCPUArray = programs.map((program) => program.MinCPU);
    const minGPUArray = programs.map((program) => program.MinGPU);

    // Search for CPU document using the Model field based on minCPUArray
    const cpu = (
      await cpuModel
        .find({
          Model: { $in: minCPUArray },
        })
        .limit(1)
    )[0];
    const gpu = (
      await gpuModel
        .find({
          Model: { $in: minGPUArray },
        })
        .limit(1)
    )[0];

    response.json({
      result: {
        cpu,
        gpu,
      },
    });
  } catch (error) {
    next(new apiError(error.message, 400));
  }
};
