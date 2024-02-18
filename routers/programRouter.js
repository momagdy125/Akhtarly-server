const express = require("express");
const programController = require("../controllers/programController.js");
const auth = require("../middlewares/auth.js");
const { rule } = require("../Utils/rules.js");

const programRouter = express.Router();

programRouter.get("/", auth.verifyToken, programController.getAllPrograms);

programRouter.post(
  "/",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  programController.createProgram
);

programRouter.put(
  "/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  programController.editProgram
);

programRouter.delete(
  "/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  programController.deleteProgram
);

module.exports = programRouter;
