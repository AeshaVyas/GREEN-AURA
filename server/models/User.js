const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: {
    type: Number,
    unique: true
  },
  uname: {
    type: String,
    required: true
  },
  uemail: {
    type: String,
    required: true,
    unique: true
  },
  upassword: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true
  },
  ustatus: {
    type: String,
    enum: ["active", "blocked"],
    default: "active"
  },
  resetToken: String,
  resetTokenExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);