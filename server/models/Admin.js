const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  aemail: {
    type: String,
    required: true,
    unique:true
  },
  apassword: {
    type: String,
    required: true
  },
  lastLogin: Date
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
