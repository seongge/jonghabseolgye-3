const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    alarm_type: {
      type: String,
      required: true,
      enum: ["comment", "notice"],
      index: true,
    },
    notice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notice",
      default: null,
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    alarm_body: {
      type: String,
      required: true,
      trim: true,
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    collection: "alarm",
  }
);

module.exports = mongoose.model("Alarm", alarmSchema);
