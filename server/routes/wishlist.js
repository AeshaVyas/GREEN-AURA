const express = require("express");
const Wishlist = require("../models/Wishlist")
const Product = require("../models/Product"); // To fetch product info
const Counter = require("../models/Counter");  // Your counter model
const router = express.Router();

// Helper: get next sequence number
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// GET wishlist by user ID
router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const wishlistItems = await Wishlist.find({ uid });

    const populatedItems = await Promise.all(
      wishlistItems.map(async (item) => {
        const product = await Product.findOne({ pid: item.pid });
        return {
          wid: item.wid,
          uid: item.uid,
          pid: item.pid,
          pname: product?.pname || "",
          price: product?.price || 0,
          images: product?.images || [],
        };
      })
    );

    res.json(populatedItems);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// POST: Add to wishlist
router.post("/add", async (req, res) => {
  try {
    const { uid, pid } = req.body;

    const exists = await Wishlist.findOne({ uid, pid });
    if (exists) return res.status(400).json({ message: "Already in wishlist" });

    // ✅ Use Counter to generate wid
    const newWid = await getNextSequence("wishlist");

    const newItem = new Wishlist({ wid: newWid, uid, pid });
    await newItem.save();

    res.json({ message: "Added to wishlist", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// DELETE wishlist item by wid
router.delete("/:wid", async (req, res) => {
  try {
    const { wid } = req.params;
    await Wishlist.deleteOne({ wid });
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;