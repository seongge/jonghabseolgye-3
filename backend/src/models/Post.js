const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    board_type: {
      type: String,
      required: true,
      enum: ["free", "major"],
    },
    target_major: {
      type: String,
      default: null,
    },
    grade_filter: {
      type: [Number],
      default: [1, 2, 3, 4],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    like_count: {
      type: Number,
      default: 0,
    },
    comment_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Post", postSchema);