const mongoose = require("mongoose");

const cpuSchema = new mongoose.Schema({
  cpu: {
    type: String,
    required: true,
  },
  mark: {
    type: String,
    required: true,
  },
});

const cpuModel = mongoose.model("cpus", cpuSchema);
module.exports = cpuModel;
