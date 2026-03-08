// const express = require("express");
// const router = express.Router();
// const Review = require("../models/Review");

// // ================= CREATE REVIEW =================
// router.post("/create", async (req, res) => {
//   try {
//     const { uid, pid, rating, comment } = req.body;

//     if (uid == null || pid == null || rating == null || !comment) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     // Prevent duplicate review
//     const existing = await Review.findOne({ uid, pid });
//     if (existing) {
//       return res
//         .status(400)
//         .json({ message: "You already reviewed this product" });
//     }

//     const newReview = new Review({
//       uid,
//       pid,
//       rating,
//       comment
//     });

//     await newReview.save();

//     res.json({ message: "Review added successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error creating review" });
//   }
// });

// // ================= GET REVIEWS BY PRODUCT =================
// router.get("/:pid", async (req, res) => {
//   try {

//     const pid = Number(req.params.pid);

//     const reviews = await Review.aggregate([
//       {
//         $match: { pid }
//       },
//       {
//         $lookup: {
//           from: "users",        // MongoDB collection name
//           localField: "uid",    // Review.uid
//           foreignField: "uid",  // User.uid
//           as: "user"
//         }
//       },
//       {
//         $unwind: {
//           path: "$user",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $project: {
//           rid: 1,
//           rating: 1,
//           comment: 1,
//           createdAt: 1,
//           uname: {
//             $ifNull: ["$user.uname", "Unknown User"]
//           }
//         }
//       },
//       {
//         $sort: { createdAt: -1 }
//       }
//     ]);

//     res.json(reviews);

//   } catch (error) {
//     console.error("FETCH REVIEW ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

/* =====================================================
   CREATE REVIEW (USER SIDE) – pid is DYNAMIC
   ===================================================== */
router.post("/create", async (req, res) => {
  try {
    const { uid, pid, rating, comment } = req.body;

    if (!uid || !pid || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ❌ Prevent duplicate review by same user on same product
    const existing = await Review.findOne({ uid, pid });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    const newReview = new Review({
      uid,           // dynamic user id
      pid,           // ✅ dynamic product id
      rating,
      comment
    });

    await newReview.save();

    res.json({ message: "Review added successfully" });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
    res.status(500).json({ message: "Error creating review" });
  }
});

/* =====================================================
   GET REVIEWS BY PRODUCT (USER SIDE)
   ===================================================== */
router.get("/product/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);

    const reviews = await Review.aggregate([
      { $match: { pid } },

      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "uid",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          rid: 1,
          pid: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          uname: { $ifNull: ["$user.uname", "Unknown User"] }
        }
      },

      { $sort: { createdAt: -1 } }
    ]);

    res.json(reviews);
  } catch (error) {
    console.error("FETCH PRODUCT REVIEWS ERROR:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

/* =====================================================
   GET ALL REVIEWS (ADMIN SIDE)
   ===================================================== */
router.get("/all", async (req, res) => {
  try {
    const reviews = await Review.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "uid",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "products",
          localField: "pid",
          foreignField: "pid",
          as: "product"
        }
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          rid: 1,
          pid: 1,                      // ✅ dynamic pid
          rating: 1,
          comment: 1,
          createdAt: 1,
          uname: { $ifNull: ["$user.uname", "Unknown"] },
          pname: { $ifNull: ["$product.pname", "Unknown"] }
        }
      },

      { $sort: { createdAt: -1 } }
    ]);

    res.json(reviews);
  } catch (error) {
    console.error("FETCH ALL REVIEWS ERROR:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

/* =====================================================
   DELETE REVIEW (ADMIN SIDE)
   ===================================================== */
router.delete("/:rid", async (req, res) => {
  try {
    const rid = Number(req.params.rid);

    const deleted = await Review.findOneAndDelete({ rid });

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;