const mongoose = require("mongoose");

const IctCAUSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: String
});

global.IctCAUNotice =
  global.IctCAUNotice || mongoose.model("IctCAUNotice", IctCAUSchema);
module.exports = global.IctCAUNotice;
