const mongoose = require("mongoose");
const Counter = require("./Counter");

const reviewSchema = new mongoose.Schema(
  {
    rid: {
      type: Number
    },

    uid: {
      type: Number,
      required: true
    },

    pid: {
      type: Number,
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);



// ✅ AUTO INCREMENT RID
reviewSchema.pre("save", async function () {
  if (this.isNew) {

    const counter = await Counter.findOneAndUpdate(
      { id: "reviewid" },        // ✅ use id field
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.rid = counter.seq;
  }
});

module.exports = mongoose.model("Review", reviewSchema);