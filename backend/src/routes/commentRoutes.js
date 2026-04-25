const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const authMiddleware = require("../middlewares/authMiddleware");

// 댓글 작성
router.post("/posts/:postId/comments", authMiddleware, createComment);

// 특정 게시글 댓글 목록 조회
router.get("/posts/:postId/comments", authMiddleware, getCommentsByPost);

// 댓글 수정
router.put("/comments/:commentId", authMiddleware, updateComment);

// 댓글 삭제
router.delete("/comments/:commentId", authMiddleware, deleteComment);

module.exports = router;