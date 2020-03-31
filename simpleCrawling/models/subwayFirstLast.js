const mongoose = require("mongoose");

const SubwayFirstLastSchema = new mongoose.Schema({
  number: Number,
  data: String
});

global.SubwayFirstLast =
  global.SubwayFirstLast ||
  mongoose.model("SubwayFirstLast", SubwayFirstLastSchema);
module.exports = global.SubwayFirstLast;
