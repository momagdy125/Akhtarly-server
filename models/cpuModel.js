const mongoose = require("mongoose");

const cpuSchema = new mongoose.Schema({
  Type: {
    type: String,
    default: "CPU",
  },
  PartNumber: {
    required: false,
    type: String,
  },
  Brand: {
    type: String,
    enum: {
      values: ["Intel", "AMD"],
      message: `Invalid Brand!,choose Intel or AMD`,
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
  },
  Benchmark: {
    type: Number,
    required: true,
  },
  Samples: {
    type: Number,
  },
  URL: {
    required: true,
    type: String,
    // Regular expression to ensure the field starts with the specified URL
    match: /^https:\/\/cpu\.userbenchmark\.com/,
    // Custom error message
    message: 'url must start with "https://cpu.userbenchmark.com"',
  },
});

const cpuModel = mongoose.model("cpus", cpuSchema);
module.exports = cpuModel;
