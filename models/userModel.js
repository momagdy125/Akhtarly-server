const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { rule } = require("../Utils/rules.js");

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

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
