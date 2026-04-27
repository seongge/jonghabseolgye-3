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

// 공지 목록 정렬 최적화
noticeSchema.index({ notice_scope: 1, published_at: -1 });

// 학과 공지 정렬 최적화
noticeSchema.index({ notice_scope: 1, department: 1, published_at: -1 });

// 카테고리 필터 최적화
noticeSchema.index({ category: 1 });

// 검색 최적화
noticeSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Notice", noticeSchema);