const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");


// 🔹 Admin Register
router.post("/register", async (req, res) => {
  const { aemail, apassword } = req.body;

  try {
    const newAdmin = new Admin({
      aemail,
      apassword
    });

    await newAdmin.save();
    res.json({ message: "Admin Created Successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error creating admin" });
  }
});


// 🔹 Admin Login
router.post("/login", async (req, res) => {
  const { aemail, apassword } = req.body;

  try {
    const admin = await Admin.findOne({ aemail });

    if (!admin)
      return res.status(400).json({ message: "Admin Not Found" });

    if (admin.apassword !== apassword)
      return res.status(400).json({ message: "Invalid Password" });

    const lastLogin = admin.lastLogin;
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      message: "Login Successful",
      lastLogin
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// 🔹 Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { aemail } = req.body;

  try {
    const admin = await Admin.findOne({ aemail });

    if (!admin)
      return res.status(404).json({ message: "Admin Not Found" });

    res.json({ apassword: admin.apassword });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;