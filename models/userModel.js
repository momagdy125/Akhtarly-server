const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { rule } = require("../Utils/rules.js");
const generateCode = require("../Utils/generateCode.js");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: [true, "this email is used"],
    required: true,
    lowercase: true,
    validate: [validator.isEmail, "not valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // don't show this in the response
  },
  rule: {
    type: String,
    enum: {
      values: [rule.ADMIN, rule.USER, rule.OWNER],
    },
    required: true,
  },
  hashedCode: String, // Added for password reset
  passwordResetCodeExpires: Date,

  // favoriteList: {
  //   type: [mongoose.Types.ObjectId, "invalid Movie Id"],
  //   required: false,
  // },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = async function (inputPass, dbPassword) {
  return await bcrypt.compare(inputPass, dbPassword);
};
userSchema.methods.createResetPassword = async function () {
  const resetCode = generateCode();

  this.hashedCode = await bcrypt.hash(resetCode, 12);

  this.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000; // expire after 10 minutes

  return resetCode;
};
userSchema.methods.compareResetCode = async function (inputCode, DBcode) {
  return await bcrypt.compare(inputCode, DBcode);
};
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
