const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  title: String,
  link: String,
  date: String,
  priceinfo: String,
  menuinfo: String
});

global.FoodNotice =
  global.FoodNotice || mongoose.model("FoodNotice", FoodSchema);
module.exports = global.FoodNotice;
