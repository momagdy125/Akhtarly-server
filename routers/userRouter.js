const userController = require("../controllers/userController");
const auth = require("../middlewares/auth.js");
const { rule } = require("../Utils/rules.js");
const express = require("express");

const userRouter = express.Router();

//login , sign up and verify account
userRouter.post("/signup", userController.signUp);

userRouter.post(
  "/sendVC",
  auth.validateEmail,
  auth.isVerified,
  userController.sendVerificationCode
);

userRouter.patch(
  "/verify",
  auth.validateEmail,
  auth.isVerified,
  auth.validateOTP,
  userController.verifyAccount
);

userRouter.post("/login", userController.login);

//forgot password
userRouter.post(
  "/forgotPassword-sendCode",
  userController.forgotPassword_sendCode
);

userRouter.post(
  "/forgotPassword-submitCode",
  auth.validateEmail,
  auth.validateOTP,
  userController.forgotPassword_submitCode
);

userRouter.patch(
  "/forgotPassword-change",
  auth.validateEmail,
  auth.validateOTP,
  userController.forgotPassword_change
);

//get profile
userRouter.get("/profile", auth.verifyToken, userController.getProfile);

//admin
userRouter.get(
  "/allUsers",
  auth.verifyToken,
  auth.isAuthorized(rule.OWNER, rule.ADMIN),
  userController.getAllUser
);

//owner
userRouter.patch(
  "/changeRule/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.OWNER),
  userController.changeRule
);
module.exports = userRouter;
