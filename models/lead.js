const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leadSchema = new Schema({
  leadID: {
    type: Number,
    required: true,
  },
  landing: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
});

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
