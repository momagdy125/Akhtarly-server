const userModel = require("../models/userModel");
const apiError = require("../Utils/apiError");
const jwt = require("jsonwebtoken");
const { rule } = require("../Utils/rules.js");

exports.signUp = (request, response, next) => {
  userModel
    .create({ ...request.body, rule: rule.USER })
    .then((user) => {
      const token = createToken(user);
      response.status(201).json({ message: "created", user, token });
    })
    .catch((error) => {
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
