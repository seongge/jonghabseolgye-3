const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    alarm_type: {
      type: String,
      required: true,
      enum: ["comment", "notice"]
    },
    notice_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    alarm_body: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    collection: "alarm"
  }
);

module.exports = mongoose.model("Alarm", alarmSchema);
