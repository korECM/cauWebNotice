const mongoose = require("mongoose");

const NurseSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: String
});

global.NurseNotice =
  global.NurseNotice || mongoose.model("NurseNotice", NurseSchema);
module.exports = global.NurseNotice;
