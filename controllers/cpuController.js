const cpuModel = require("../models/cpuModel");
const apiError = require("../Utils/apiError");
const { basicQueryProcess } = require("../Utils/queryProcesses");

exports.getAllCpus = async (req, res, next) => {
  try {
    var { Query, DefaultLimit, fields } = basicQueryProcess(req);

    const cpus = cpuModel
      .find(Query)
      .sort(req.query.sort)
      .limit(req.query.limit)
      .skip((req.query.page - 1) * DefaultLimit)
      .select(fields);

    res.json({
      state: "success",
      length: cpus.length,
      result: cpus,
    });
  } catch (error) {
    next(new apiError(error.message, 404));
  }
};
exports.createCpu = (req, res, next) => {
  cpuModel
    .create(req.body)
    .then((cpu) => {
      res.json({ state: "success", cpu });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(error);
      }
      return next(new apiError(error.message, 400));
    });
};

exports.editCpu = (req, res, next) => {
  cpuModel
    .findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    .then((updatedCpu) => {
      res.status(201).json({
        state: "success",
        updatedCpu,
      });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${req.params.id}`, 404));
    });
};
exports.deleteCpu = (req, res, next) => {
  cpuModel
    .findByIdAndDelete(req.params.id, { new: true })
    .then((cpu) => {
      res.status(200).json({ state: "success", DeletedCpu: cpu });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${req.params.id}`, 404));
    });
};
