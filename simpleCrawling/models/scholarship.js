const mongoose = require("mongoose");

const ScholarshipSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: String
});

global.ScholarshipNotice =
  global.ScholarshipNotice || mongoose.model("ScholarshipNotice", BneSchema);
module.exports = global.ScholarshipNotice;
