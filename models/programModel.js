const mongoose = require("mongoose");

const gpuSchema = new mongoose.Schema({
  Software_Game: {
    type: String,
    required: true,
  },
  MinCPU: {
    type: String,
    required: true,
  },
  MinGPU: {
    type: String,
    required: true,
  },
  MinRAM: {
    type: Number,
    required: true,
  },
  MaxRAM: {
    type: Number,
    required: true,
  },
  MaxCPU: {
    type: String,
    required: true,
  },
  MaxGPU: {
    type: String,
    required: true,
  },
  MaxRAM: {
    type: Number,
    required: true,
  },
  STRG: {
    required: true,
    type: Number,
  },
});

const gpuModel = mongoose.model("GPU", gpuSchema);
module.exports = gpuModel;
