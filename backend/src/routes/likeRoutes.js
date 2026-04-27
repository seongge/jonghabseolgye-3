const express = require("express");
const router = express.Router();

const {
  togglePostLike,
  toggleCommentLike,
} = require("../controllers/likeController");

const authMiddleware = require("../middlewares/authMiddleware");

// 게시글 좋아요 토글
router.post("/posts/:postId/like", authMiddleware, togglePostLike);

// 댓글 좋아요 토글
router.post("/comments/:commentId/like", authMiddleware, toggleCommentLike);

module.exports = router;