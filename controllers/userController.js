const userModel = require("../models/userModel");
const apiError = require("../Utils/apiError");
const jwt = require("jsonwebtoken");
const { rule } = require("../Utils/rules.js");
const sendEmail = require("../Utils/mail");

exports.signUp = (request, response, next) => {
  userModel
    .create({ ...request.body, rule: rule.USER })
    .then((user) => {
      const token = createToken(user);
      response.status(201).json({ message: "created", user, token });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        // If it is, pass it to the next middleware (global error handler)
        return next(error);
      }
      return next(new apiError(error.message, 400));
    });
};
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    const user = await userModel.findOne({ email }).select("+password");
    if (user) {
      const isMatch = await user.comparePassword(password, user.password);
      if (isMatch) {
        const token = createToken(user);
        res.status(200).send({ state: "success", token });
      } else {
        return next(new apiError("wrong password", 401));
      }
    } else {
      return next(new apiError("user doesn't exit", 400));
    }
  } else {
    return next(new apiError("please enter all fields", 400));
  }
};

exports.forgotPassword_sendCode = async (req, res, next) => {
  try {
    if (!req.body.email) return next(new apiError("provide an email ", 400));

    const user = await userModel.findOne({ email: req.body.email });

    if (!user) return next(new apiError("email not found ", 404));

    const resetCode = await user.createResetPassword();

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
      "now make patch request with the code and , email and the the new password ",
  });
};
exports.forgotPassword_change = async (req, res, next) => {
  try {
    if (!req.body.password)
      return next(new apiError("please provide the new password", 400));
    const user = res.locals.user;

    user.password = req.body.password;
    user.hashedCode = undefined;
    user.passwordResetCodeExpires = undefined;

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
  if (req.body.rule) {
    if (![rule.ADMIN, rule.USER].includes(req.body.rule)) {
      return next(new apiError("invalid rule provided", 400));
    }
    userModel
      .findByIdAndUpdate(req.params.id, { rule: req.body.rule }, { new: true })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((error) => {
        return next(new apiError("user not found", 404));
      });
  } else {
    return next(new apiError("Please provide rule", 400));
  }
};
exports.getAllUser = (req, res) => {
  userModel.find(req.query).then((users) => {
    res.status(200).json({ state: "success", users: users });
  });
};
exports.getProfile = (req, res) => {
  res.status(200).json({ state: "success", profile: req.userData });
};

function createToken(user) {
  return jwt.sign(
    { id: user._id, rule: user.rule, name: user.name, email: user.email },
    process.env.secret_str,
    {
      expiresIn: process.env.expireIn,
    }
  );
}
