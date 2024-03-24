const mongoose = require("mongoose");

const laptopSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    required: true,
    type: Number,
  },
  spec_rating: {
    required: true,
    type: Number,
  },
  processor: {
    type: String,
    required: true,
  },
  CPU: {
    type: String,
    required: true,
  },
  Ram: {
    type: String,
    required: true,
  },
  Ram_type: {
    type: String,
    required: true,
  },
  ROM: {
    type: String,
    required: true,
  },
  ROM_type: {
    type: String,
    required: true,
  },
  GPU: {
    type: String,
    required: true,
  },
  display_size: {
    required: true,
    type: Number,
  },
  resolution_width: {
    required: true,
    type: Number,
  },
  resolution_height: {
    required: true,
    type: Number,
  },
  OS: {
    type: String,
    required: true,
  },
  warranty: {
    required: true,
    type: Number,
  },
  type: {
    required: true,
    type: String,
  },
});

const gpuModel = mongoose.model("laptops", laptopSchema);
module.exports = gpuModel;
