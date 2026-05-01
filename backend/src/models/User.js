const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true,
      trim: true
    },
    grade: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4]
    },
    major: {
      type: String,
      required: true,
      trim: true
    },
    student_number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    role: {
      type: String,
      default: "student",
      enum: ["student", "admin"]
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("User", userSchema);