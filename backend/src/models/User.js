const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
    },
    nickname: {
      type: String,
      trim: true,
    },
    grade: {
      type: Number,
    },
    major: {
      type: String,
      trim: true,
      index: true,
    },
    double_major: {
      type: String,
      trim: true,
      default: null,
    },
    student_number: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "student",
      enum: ["student", "admin"],
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
    collection: "users",
  }
);

module.exports = mongoose.model("User", UserSchema);
