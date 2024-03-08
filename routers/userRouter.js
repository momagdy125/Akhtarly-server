const userController = require("../controllers/userController");
const utils = require("../middlewares/auth.js");
const { rule } = require("../Utils/rules.js");
const express = require("express");

const userRouter = express.Router();

//login and sign up
userRouter.post("/login", userController.login);

userRouter.post("/signup", userController.signUp);

//forgot password
userRouter.post(
  "/forgotPassword-sendCode",
  userController.forgotPassword_sendCode
);

userRouter.post(
  "/forgotPassword-submitCode",
  utils.validateOTPAndEmail,
  userController.forgotPassword_submitCode
);

userRouter.patch(
  "/forgotPassword-change",
  utils.validateOTPAndEmail,
  userController.forgotPassword_change
);
//get profile
userRouter.get("/profile", utils.verifyToken, userController.getProfile);

//owner
userRouter.patch(
  "/changeRule/:id",
  utils.verifyToken,
  utils.isAuthorized(rule.OWNER),
  userController.changeRule
);
//admin
userRouter.get(
  "/allUsers",
  utils.verifyToken,
  utils.isAuthorized(rule.OWNER, rule.ADMIN),
  userController.getAllUser
);
module.exports = userRouter;
