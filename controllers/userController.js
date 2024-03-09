const userModel = require("../models/userModel");
const apiError = require("../Utils/apiError");
const jwt = require("jsonwebtoken");
const { rule } = require("../Utils/rules.js");
const sendEmail = require("../Utils/mail");

exports.signUp = async (req, res, next) => {
  try {
    const user = await userModel.create({
      ...req.body,
      rule: rule.USER,
      verified: false,
    });
    res.status(201).send({
      state: "created ",
      data: user,
      message: "now please request verification code ",
    });
  } catch (error) {
    return next(error);
  }
};
exports.sendVerificationCode = async (req, res, next) => {
  const user = res.locals.user;

  const verificationCode = await user.createOTP();

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: req.body.email,
    subject: "Account verification",
    text: `your verification code for your account is ${verificationCode}, this code will be expired in 10 minutes so hurry please!!`,
  });

  res.status(200).json({
    state: "success",
    message:
      "we sent a verification code to your email note: check your spam if you didn't find the message in your inbox",
  });
};
exports.verifyAccount = async (req, res, next) => {
  const user = res.locals.user;

  user.verified = true;
  user.hashedCode = undefined;
  user.codeExpired = undefined;
  await user.save();

  const token = createToken(user);
  res.send({
    state: "email verified successfully",
    token,
  });
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password)
    return next(new apiError("please enter all fields", 400));

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) return next(new apiError("user doesn't exit", 404));

  const isMatch = await user.comparePassword(password, user.password);

  if (!isMatch) return next(new apiError("wrong password", 401));

  if (!user.verified)
    return next(new apiError("Your account is not yet verified", 403));

  const token = createToken(user);
  res.status(200).send({ state: "success", token });
};

exports.forgotPassword_sendCode = async (req, res, next) => {
  try {
    if (!req.body.email) return next(new apiError("provide an email ", 400));

    const user = await userModel.findOne({ email: req.body.email });

    if (!user) return next(new apiError("email not found ", 404));

    const resetCode = await user.createOTP();

    await sendEmail({
      email: user.email,
      subject: "reset password code",
      text: `your reset code for your password is ${resetCode},will be expired in 10 minutes !!`,
    });

    await user.save({ validateBeforeSave: false });
    res.json({
      state: "Success",
      message: `Reset password code sent to your email ${req.body.email},"will be expired in 10 minutes !!" note :check your spam if you didn't found the message in your inbox `,
    });
  } catch (error) {
    return next(new apiError("too many requests please try again later ", 500));
  }
};

exports.forgotPassword_submitCode = async (req, res, next) => {
  res.send({
    state: "code is correct",
    message:
      "now make patch request with the code , email and the the new password ",
  });
};

exports.forgotPassword_change = async (req, res, next) => {
  try {
    if (!req.body.password)
      return next(new apiError("please provide the new password", 400));
    const user = res.locals.user;

    user.password = req.body.password;
    user.hashedCode = undefined;
    user.codeExpired = undefined;

    await user.save();
    res.status(200).send({
      state: "success",
      message: "password changed successfully ",
    });
  } catch (error) {
    return next(new apiError(error.message, 500));
  }
};

exports.changeRule = (req, res, next) => {
  if (req.body.rule) return next(new apiError("Please provide rule", 400));

  if (![rule.ADMIN, rule.USER].includes(req.body.rule))
    return next(new apiError("invalid rule provided", 400));

  userModel
    .findByIdAndUpdate(req.params.id, { rule: req.body.rule }, { new: true })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      return next(new apiError("user not found", 404));
    });
};

exports.getAllUser = async (req, res) => {
  const users = await userModel.find(req.query);
  res.status(200).json({ state: "success", users });
};

exports.getProfile = (req, res) => {
  res.status(200).json({ state: "success", profile: req.userData });
};

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      rule: user.rule,
      name: user.name,
      email: user.email,
      verified: user.verified,
    },
    process.env.secret_str,
    {
      expiresIn: process.env.expireIn,
    }
  );
}
