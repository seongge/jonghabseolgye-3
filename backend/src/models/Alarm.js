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

// 사용자별 알림 조회와 중복 방지용 upsert 성능을 위한 인덱스
alarmSchema.index({ user_id: 1, alarm_type: 1, notice_id: 1 });
alarmSchema.index({ user_id: 1, alarm_type: 1, comment_id: 1 });

module.exports = mongoose.model("Alarm", alarmSchema);
