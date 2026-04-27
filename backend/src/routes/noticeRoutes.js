const express = require("express");
const router = express.Router();

const {
  getSchoolNotices,
  getDepartmentNotices,
  getNoticeById,
} = require("../controllers/noticeController");

const authMiddleware = require("../middlewares/authMiddleware");

// 학교 공지 목록 조회
router.get("/school", authMiddleware, getSchoolNotices);

// 내 학과 공지 목록 조회
router.get("/department", authMiddleware, getDepartmentNotices);

// 공지 상세 조회
router.get("/:noticeId", authMiddleware, getNoticeById);

module.exports = router;