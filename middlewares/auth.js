const jwt = require("jsonwebtoken");
const apiError = require("../Utils/apiError");
const userModel = require("../models/userModel");

exports.verifyToken = (req, res, next) => {
  try {
    if (!(req.headers["Authorization"] || req.headers["authorization"])) {
      return next(new apiError("please provide the token", 400));
    }
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.secret_str);
    delete payload.iat;
    delete payload.exp;

    req.userData = payload;

    next();
  } catch (e) {
    return next(new apiError("invalid Token", 400));
  }
};

exports.isAuthorized = (...rules) => {
  return function (req, res, next) {
    if (rules.includes(req.userData.rule)) {
      return next();
    }
    return next(new apiError("Unauthorized", 401));
  };
};

exports.validateOTP = async (req, res, next) => {
  const user = res.locals.user;

  if (!user.hashedCode)
    return next(new apiError("please request code first", 400));

  const isMatch = await user.compareOTPs(req.body.code, user.hashedCode);

  if (!isMatch) return next(new apiError("Invalid Code", 400));

  if (user.codeExpired < Date.now())
    return next(new apiError("the code has expired", 400));

  res.locals.user = user;
  next();
};
exports.validateEmail = async (req, res, next) => {
  if (!req.body.email)
    return next(new apiError("please provide an email ", 400));

  const user = await userModel.findOne({
    email: req.body.email,
  });
  if (!user) return next(new apiError("User not found", 404));

  res.locals.user = user;
  next();
};

exports.isVerified = async (req, res, next) => {
  const user = res.locals.user;
  if (user.verified)
    return next(new apiError("Account already  verified", 400));

  next();
};
