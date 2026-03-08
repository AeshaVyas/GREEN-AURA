const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  pname: { type: String, required: true },
  pdescription: { type: String, required: true },
  cid: { type: String, required: true },   // manual category id
  scid: { type: String, required: true },  // manual subcategory id
  price: { type: Number, required: true },
  color: [String],
  size: [String],
  stock: { type: Number, required: true },
  status: { type: String, default: "isavailable" },
  images: [String]
},{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);