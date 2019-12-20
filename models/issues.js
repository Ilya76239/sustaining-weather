"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Issues = new Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, required: true, default: Date.now },
  updated_on: { type: Date, required: true, default: Date.now },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  open: { type: Boolean, required: true, default: true },
  status_text: { type: String, default: "" }
});

module.exports = mongoose.model("Issues", Issues);
