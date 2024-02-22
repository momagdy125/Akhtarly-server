const express = require("express");
const laptopController = require("../controllers/laptopController.js");
const auth = require("../middlewares/auth.js");
const { rule } = require("../Utils/rules.js");

const laptopRouter = express.Router();

laptopRouter.get("/", auth.verifyToken, laptopController.getAllLaptops);

laptopRouter.post(
  "/addLaptop",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  laptopController.addLaptop
);

laptopRouter.put(
  "/editLaptop/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  laptopController.editLaptop
);

laptopRouter.delete(
  "/deleteLaptop/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  laptopController.deleteLaptop
);

module.exports = laptopRouter;
