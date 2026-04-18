const express = require("express");
const router = express.Router();

const { createPost, getPosts } = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

// 게시글 작성
router.post("/", authMiddleware, createPost);

// 게시글 목록 조회
router.get("/", authMiddleware, getPosts);

module.exports = router;