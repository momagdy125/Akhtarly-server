const userController = require("../controllers/userController");
const utils = require("../middlewares/auth.js");
const { rule } = require("../Utils/rules.js");
const express = require("express");

const userRouter = express.Router();

userRouter.get(
  "/allUsers",
  utils.verifyToken,
  utils.isAuthorized(rule.OWNER, rule.ADMIN),
  userController.getAllUser
);

userRouter.post("/signup", userController.signUp);

userRouter.post("/login", userController.login);

userRouter.get("/profile", utils.verifyToken, userController.getProfile);

userRouter.patch(
  "/changeRule/:id",
  utils.verifyToken,
  utils.isAuthorized(rule.OWNER),
  userController.changeRule
);

module.exports = userRouter;
