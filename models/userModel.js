const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { rule } = require("../Utils/rules.js");
const generateCode = require("../Utils/generateCode.js");
const sendVC = require("../Utils/mail/send_vc");

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
  },
  verified: {
    type: Boolean,
    default: false,
  },
  changePassAt: { type: Date, default: undefined },
  TokenCreatedAt: { type: Number, default: undefined },
  hashedCode: String,
  codeExpired: Date,

  // favoriteList: {
  //   type: [mongoose.Types.ObjectId, "invalid Movie Id"],
  //   required: false,
  // },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 12);
    this.changePassAt = Math.floor(Date.now() / 1000);
  }
  if (this.isNew) {
    this.rule = rule.USER;
    this.verified = false;
    const OTP = await this.createOTP();
    await sendVC(this.email, OTP);
  }

  next();
});

userSchema.methods.comparePassword = async function (inputPass, dbPassword) {
  return await bcrypt.compare(inputPass, dbPassword);
};

userSchema.methods.createOTP = async function () {
  const OTP = generateCode();

  this.hashedCode = await bcrypt.hash(OTP, 12);

  this.codeExpired = Date.now() + 10 * 60 * 1000; // expire after 10 minutes

  return OTP;
};

userSchema.methods.compareOTPs = async function (inputCode, DBcode) {
  return await bcrypt.compare(inputCode, DBcode);
};
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
