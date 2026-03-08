const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const session = require("express-session");

const app = express();

const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const reviewRoutes = require("./routes/review");

const path = require("path");

// Middleware
app.use(cors({
  origin: "http://localhost:3000",  // React port
  credentials: true
}));
// 🔐 Session Setup
app.use(session({
  secret: "greenAuraSecretKey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,   // true only in production https
    maxAge: 1000 * 60 * 60  // 1 hour
  }
}));
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/review", reviewRoutes);
// app.use("/uploads", express.static("uploads"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("Green Aura Server Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));