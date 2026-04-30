const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema(
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
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    source_url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    source_site: {
      type: String,
      required: true,
      trim: true,
    },
    published_at: {
      type: Date,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Notice", NoticeSchema);
