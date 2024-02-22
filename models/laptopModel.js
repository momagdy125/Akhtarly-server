const mongoose = require("mongoose");

const laptopSchema = new mongoose.Schema({
  Company: {
    type: String,
    required: [true, "Company field is required"],
  },
  TypeName: {
    type: String,
    required: [true, "TypeName field is required"],
  },
  Product: {
    type: String,
    required: [true, "Product field is required"],
  },
  Inches: {
    type: Number,
    required: [true, "Inches field is required"],
  },
  ScreenResolution: {
    type: String,
    required: [true, "ScreenResolution field is required"],
  },
  Ram: {
    type: String,
    required: [true, "Ram field is required"],
  },
  Cpu: {
    type: String,
    required: [true, "Cpu field is required"],
  },
  Gpu: {
    type: String,
    required: [true, "Gpu field is required"],
  },
  OpSys: {
    type: String,
    required: [true, "OpSys field is required"],
  },
  Memory: {
    type: String,
    required: [true, "Memory field is required"],
  },
  Weight: {
    type: String,
    required: [true, "Weight field is required"],
  },
  Price_in_euros: {
    required: false,
    type: Number,
  },
});

const gpuModel = mongoose.model("laptops", laptopSchema);
module.exports = gpuModel;
