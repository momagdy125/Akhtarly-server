const laptopModel = require("../models/laptopModel");
const apiError = require("../Utils/apiError");
const {
  RemovingFieldsFromQuery,
  querySupportComparisons,
  querySupportSubstring,
  pagination,
} = require("../Utils/queryProcesses");

exports.getAllLaptops = (request, response, next) => {
  var Query = querySupportComparisons(request.query);
  Query = querySupportSubstring(Query, "Product", "Cpu", "Gpu");
  Query = RemovingFieldsFromQuery(Query, ["limit", "sort", "page"]);
  const DefaultLimit = pagination(request);

  laptopModel
    .find(Query, { __v: false })
    .select("-laptop_ID") //remove laptop_ID
    .sort(request.query.sort)
    .limit(request.query.limit)
    .skip((request.query.page - 1) * DefaultLimit)
    .then((Laptops) => {
      response.json({
        state: "success",
        length: Laptops.length,
        result: Laptops,
      });
    })
    .catch((error) => {
      next(new apiError(error.message, 404));
    });
};
exports.addLaptop = (request, response, next) => {
  laptopModel
    .create(request.body)
    .then((laptop) => {
      response.json({ state: "success", laptop });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(error);
      }
      return next(new apiError(error.message, 400));
    });
};

exports.editLaptop = (request, response, next) => {
  laptopModel
    .findByIdAndUpdate(request.params.id, request.body, {
      runValidators: true,
      new: true,
    })
    .then((updatedLaptop) => {
      response.status(201).json({
        state: "success",
        updatedLaptop,
      });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};
exports.deleteLaptop = (request, response, next) => {
  laptopModel
    .findByIdAndDelete(request.params.id, { new: true })
    .then((laptop) => {
      response.status(200).json({ state: "success", DeletedLaptop: laptop });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};
