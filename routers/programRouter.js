const express = require("express");
const programController = require("../controllers/programController.js");
const auth = require("../middlewares/auth.js");
const {
  listOfObjectIdValidation,
} = require("../middlewares/objectIdValidation");
const { rule } = require("../Utils/rules.js");

const programRouter = express.Router();

programRouter.get("/", auth.verifyToken, programController.getAllPrograms);

programRouter.post(
  "/createProgram",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  programController.createProgram
);

programRouter.post(
  "/sendPrograms",
  auth.verifyToken,
  listOfObjectIdValidation,
  programController.sendPrograms
);

programRouter.put(
  "/editProgram/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  programController.editProgram
);

programRouter.delete(
  "/deleteProgram/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  programController.deleteProgram
);

module.exports = programRouter;
