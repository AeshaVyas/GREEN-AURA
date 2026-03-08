const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/Product");
const Review = require("../models/Review");
/* ========================= */
/* Multer Setup */
/* ========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);   // ✅ ORIGINAL NAME ONLY
  },
});

/* ========================= */
/* Multer Setup (ORIGINAL NAME) */
/* ========================= */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname); // ✅ ORIGINAL NAME ONLY
//   },
// });

// module.exports = upload;
const upload = multer({ storage });

/* ========================= */
/* CREATE PRODUCT */
/* ========================= */
router.post("/create", upload.array("images"), async (req, res) => {
  try {
    const product = new Product({
      pid: req.body.pid,
      pname: req.body.pname,
      pdescription: req.body.pdescription,
      cid: req.body.cid,
      scid: req.body.scid,
      price: req.body.price,
      stock: req.body.stock,
      status: req.body.status || "isavailable",
      color: JSON.parse(req.body.color || "[]"),
      size: JSON.parse(req.body.size || "[]"),
      images: req.files.map((f) => f.filename),
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========================= */
/* READ PRODUCTS */
/* ========================= */
/* ========================= */
/* READ PRODUCTS (NEWEST FIRST) */
/* ========================= */
/* ========================= */
/* READ PRODUCTS (DESCENDING CREATED AT) */
/* ========================= */
/* ========================= */
/* READ PRODUCTS WITH PAGINATION */
/* ========================= */
router.get("/read", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20; // 20 products per page
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .sort({ _id: -1 })  // newest first
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });

  } catch (err) {
    console.error("READ PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========================= */
/* UPDATE PRODUCT */
/* ========================= */
router.put("/update/:pid", upload.array("images"), async (req, res) => {
  try {
    const existingProduct = await Product.findOne({
      pid: req.params.pid,
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imagesToKeep = JSON.parse(req.body.imagesToKeep || "[]");

    const updateData = {
      pname: req.body.pname,
      pdescription: req.body.pdescription,
      cid: req.body.cid,
      scid: req.body.scid,
      price: req.body.price,
      stock: req.body.stock,
      status: req.body.status,
      color: req.body.color
        ? JSON.parse(req.body.color)
        : existingProduct.color,
      size: req.body.size
        ? JSON.parse(req.body.size)
        : existingProduct.size,
      images: imagesToKeep,
    };

    if (req.files && req.files.length > 0) {
      updateData.images.push(...req.files.map((f) => f.filename));
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      updateData,
      { new: true }
    );

    res.json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========================= */
/* DELETE PRODUCT */
/* ========================= */
router.delete("/delete/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: req.params.pid,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========================= */
/* ✅ GET LATEST PRODUCT */
/* ========================= */
// router.get("/latest", async (req, res) => {
//   try {
//     const latestProduct = await Product.findOne()
//       .sort({ createdAt: -1 }) // newest first
//       .limit(1);

//     res.json(latestProduct);
//   } catch (err) {
//     console.error("LATEST PRODUCT ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

/* ========================= */
/* ✅ GET LATEST 8 PRODUCTS */
/* ========================= */
router.get("/latest-eight", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8);

    const productsWithRating = await Promise.all(
      products.map(async (product) => {
        const reviews = await Review.find({ pid: product.pid });

        const avgRating =
          reviews.length > 0
            ? (
              reviews.reduce((sum, r) => sum + r.rating, 0) /
              reviews.length
            ).toFixed(1)
            : 0;

        return {
          ...product.toObject(),
          avgRating,
          reviewCount: reviews.length,
        };
      })
    );

    res.json(productsWithRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

/* ===================================================== */
/* ✅ FINAL WORKING STATUS TOGGLE (ONLY ONE ROUTE) */
/* ===================================================== */
router.put("/update-status/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === "outofstock") {
      product.status = "isavailable";
      product.stock = 10;   // ✅ FORCE 10
    } else {
      product.status = "outofstock";
      product.stock = 0;    // ✅ FORCE 0
    }

    await product.save();

    res.json(product);

  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========================= */
/* ✅ RELATED PRODUCTS */
/* ========================= */
router.get("/related/:cid/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const products = await Product.find({
      cid,
      pid: { $ne: pid }, // exclude current product
      status: "isavailable",
    }).limit(4);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const name = req.query.name;

    const products = await Product.find({
      pname: { $regex: name, $options: "i" }
    }).limit(5);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Search error" });
  }
});

/* ========================= */
/* ✅ GET PRODUCTS BY CATEGORY */
/* ========================= */
router.get("/by-category/:cid", async (req, res) => {
  try {
    const products = await Product.find({
      cid: req.params.cid,
      status: "isavailable",
    });

    res.json(products);
  } catch (err) {
    console.error("CATEGORY PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========================= */
/* ✅ GET PRODUCTS BY CATEGORY + SUBCATEGORY */
/* ========================= */
router.get("/by-category/:cid/:scid", async (req, res) => {
  try {
    const products = await Product.find({
      cid: req.params.cid,
      scid: req.params.scid,
      status: "isavailable",
    });

    res.json(products);
  } catch (err) {
    console.error("SUBCATEGORY PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;