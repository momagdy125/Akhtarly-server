const jwt = require("jsonwebtoken");
const apiError = require("../Utils/apiError");

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
