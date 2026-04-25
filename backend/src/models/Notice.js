const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    notice_scope: {
      type: String,
      required: true,
      enum: ["school", "department"],
    },
    department: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: "일반",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    source_url: {
      type: String,
      required: true,
    },
    source_site: {
      type: String,
      required: true,
    },
    published_at: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

noticeSchema.index({ source_url: 1 }, { unique: true });

module.exports = mongoose.model("Notice", noticeSchema);