const mongoose = require("mongoose");

const CoeSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: String
});

global.CoeNotice = global.CoeNotice || mongoose.model("CoeNotice", CoeSchema);
module.exports = global.CoeNotice;
