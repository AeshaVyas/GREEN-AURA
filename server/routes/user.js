// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Counter = require("../models/Counter");
// const bcrypt = require("bcryptjs");

// router.post("/register", async (req, res) => {
//   try {
//     const { uname, uemail, upassword, phone, address, gender } = req.body;

//     // 🔹 Check if email exists
//     const existingUser = await User.findOne({ uemail });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // 🔥 AUTO INCREMENT UID (Atomic)
//     const counter = await Counter.findOneAndUpdate(
//       { id: "userId" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );

//     const hashedPassword = await bcrypt.hash(upassword, 10);

//     const newUser = new User({
//       uid: counter.seq,
//       uname,
//       uemail,
//       upassword: hashedPassword,
//       phone,
//       address,
//       gender
//       // ustatus default active
//     });

//     await newUser.save();

//     res.json({ message: "User Registered Successfully" });

//   } catch (error) {
//     console.log("REGISTER ERROR:", error);
//     res.status(500).json({ message: "Error Registering User" });
//   }
// });
// router.post("/login", async (req, res) => {
//   try {
//     const { uemail, upassword } = req.body;

//     const user = await User.findOne({ uemail });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (user.ustatus === "blocked") {
//       return res.status(403).json({ message: "Your account is blocked" });
//     }

//     const isMatch = await bcrypt.compare(upassword, user.upassword);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     // 🔐 Store session
//     req.session.user = {
//       id: user._id,
//       uid: user.uid,
//       uname: user.uname,
//       uemail: user.uemail
//     };

//     res.json({ message: "Login Successful", user: req.session.user });

//   } catch (error) {
//     console.log("LOGIN ERROR:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// router.get("/check-session", (req, res) => {
//   if (req.session.user) {
//     res.json({ loggedIn: true, user: req.session.user });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });

// router.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).json({ message: "Logout failed" });
//     }
//     res.clearCookie("connect.sid");
//     res.json({ message: "Logout successful" });
//   });
// });
// module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Counter = require("../models/Counter");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

router.post("/register", async (req, res) => {
  try {
    const { uname, uemail, upassword, phone, address, gender } = req.body;

    // 🔹 Check if email exists
    const existingUser = await User.findOne({ uemail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔥 AUTO INCREMENT UID (Atomic)
    const counter = await Counter.findOneAndUpdate(
      { id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const hashedPassword = await bcrypt.hash(upassword, 10);

    const newUser = new User({
      uid: counter.seq,
      uname,
      uemail,
      upassword: hashedPassword,
      phone,
      address,
      gender,
      // ustatus default active
    });

    await newUser.save();

    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: "Error Registering User" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { uemail, upassword } = req.body;

    const user = await User.findOne({ uemail });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.ustatus === "blocked") {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    const isMatch = await bcrypt.compare(upassword, user.upassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔐 Store session
    req.session.user = {
      id: user._id,
      uid: user.uid,
      uname: user.uname,
      uemail: user.uemail,
    };

    res.json({ message: "Login Successful", user: req.session.user });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

// GET ALL USERS
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.put("/block/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      ustatus: "blocked",
    });

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error blocking user" });
  }
});

// ==========================
// ACTIVATE USER
// ==========================
router.put("/activate/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      ustatus: "active",
    });

    res.json({ message: "User activated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error activating user" });
  }
});

// ==========================
// DELETE USER
// ==========================
router.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});


router.post("/reset-password", async (req, res) => {
  const { uemail, newPassword } = req.body;

  if (!uemail || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ uemail });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.upassword = hashedPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});
module.exports = router;