const mongoose = require("mongoose");

const medSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: String
});

global.medNotice = global.medNotice || mongoose.model("medNotice", medSchema);
module.exports = global.medNotice;
