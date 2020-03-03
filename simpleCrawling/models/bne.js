const mongoose = require("mongoose");

const BneSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: String
});

global.BneNotice = global.BneNotice || mongoose.model("BneNotice", BneSchema);
module.exports = global.BneNotice;
