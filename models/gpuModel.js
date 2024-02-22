const mongoose = require("mongoose");

const gpuSchema = new mongoose.Schema({
  Type: {
    type: String,
    default: "GPU",
    enum: {
      values: ["GPU"],
      message: `Invalid type!,Type should be GPU`,
    },
  },
  PartNumber: {
    required: false,
    type: String,
  },
  Brand: {
    type: String,
    enum: {
      values: ["Nvidia", "Asus", "Gigabyte", "MSI", "Zotac"],
      message: `Invalid Brand!,choose Nvidia ,Asus, Gigabyte, MSI or Zotac`,
    },
    required: true,
  },
  Model: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    min: 1,
    required: true,
  },
  Benchmark: {
    type: Number,
    required: true,
  },
  Samples: {
    type: Number,
    required: false,
  },
  URL: {
    required: true,
    type: String,
    // Regular expression to ensure the field starts with the specified URL
    match: /^https:\/\/gpu\.userbenchmark\.com/,
    // Custom error message
    message: 'url must start with "https://gpu.userbenchmark.com"',
  },
});

const gpuModel = mongoose.model("gpus", gpuSchema);
module.exports = gpuModel;
