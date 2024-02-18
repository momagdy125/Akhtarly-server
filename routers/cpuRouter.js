const express = require("express");
const cpuController = require("../controllers/cpuController.js");
const auth = require("../middlewares/auth.js");
const { rule } = require("../Utils/rules.js");

const cpuRouter = express.Router();

cpuRouter.get(
  "/",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  cpuController.getAllCpus
);

cpuRouter.post(
  "/addCpu",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  cpuController.createCpu
);

cpuRouter.put(
  "/editCpu/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  cpuController.editCpu
);

cpuRouter.delete(
  "/deleteCpu/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  cpuController.deleteCpu
);

module.exports = cpuRouter;
