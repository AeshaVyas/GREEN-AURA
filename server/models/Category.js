const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  scid: { type: String, required: true },
  scname: { type: String, required: true }
});

const categorySchema = new mongoose.Schema({
  cid: { type: String, required: true, unique: true },
  cname: { type: String, required: true },
  cdescription: { type: String, required: true },
  subcategories: [subCategorySchema]
});

module.exports = mongoose.model("Category", categorySchema);
