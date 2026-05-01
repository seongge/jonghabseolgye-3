const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

// 게시글 작성
router.post("/", authMiddleware, createPost);

// 게시글 목록 조회
router.get("/", authMiddleware, getPosts);

// 게시글 상세 조회
router.get("/:postId", authMiddleware, getPostById);

// 게시글 수정
router.put("/:postId", authMiddleware, updatePost);

// 게시글 삭제
router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;