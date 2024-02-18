const express = require("express");
const gpuController = require("../controllers/gpuController.js");
const auth = require("../middlewares/auth.js");
const { rule } = require("../Utils/rules.js");

const gpuRouter = express.Router();

gpuRouter.get(
  "/",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  gpuController.getAllGpus
);

gpuRouter.post(
  "/",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  gpuController.createGpu
);

gpuRouter.put(
  "/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  gpuController.editGpu
);

gpuRouter.delete(
  "/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  gpuController.deleteGpu
);

module.exports = gpuRouter;
