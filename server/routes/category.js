const express = require("express");
const router = express.Router();
const Category = require("../models/Category");


// ✅ CREATE CATEGORY
router.post("/create", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ADD SUBCATEGORY INTO SPECIFIC CATEGORY
router.post("/create-subcategory/:cid", async (req, res) => {
  try {

    const { scid, scname } = req.body;

    const category = await Category.findOne({
      cid: req.params.cid
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.subcategories.push({
      scid,
      scname
    });

    await category.save();

    res.json({
      message: "Subcategory added successfully",
      category
    });

  } catch (error) {
    console.log("ERROR:", error);  // 👈 VERY IMPORTANT
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:cid", async (req, res) => {
  try {

    const { cname, cdescription } = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      { cid: req.params.cid },
      { cname, cdescription },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      updatedCategory
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


// ✅ UPDATE SUBCATEGORY
router.put("/update-subcategory/:cid/:scid", async (req, res) => {
  try {

    const { scname } = req.body;

    const category = await Category.findOne({
      cid: req.params.cid
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = category.subcategories.find(
      (sub) => sub.scid === req.params.scid
    );

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subcategory.scname = scname;

    await category.save();

    res.json({
      message: "Subcategory updated successfully",
      category
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});




// ✅ READ CATEGORY
router.get("/read", async (req, res) => {
  const data = await Category.find();
  res.json(data);
});

// ✅ DELETE CATEGORY USING CID
router.delete("/delete/:cid", async (req, res) => {
  try {

    const category = await Category.findOneAndDelete({
      cid: req.params.cid
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE SUBCATEGORY
router.delete("/delete-subcategory/:cid/:scid", async (req, res) => {
  try {

    const category = await Category.findOne({
      cid: req.params.cid
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.subcategories = category.subcategories.filter(
      (sub) => sub.scid !== req.params.scid
    );

    await category.save();

    res.json({
      message: "Subcategory deleted successfully",
      category
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET ALL CATEGORIES (For Navbar)
router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find({}, {
      cname: 1,
      cid: 1,
      subcategories: 1
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;