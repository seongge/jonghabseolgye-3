const express = require("express");
const router = express.Router();

const {
  togglePostLike,
  toggleCommentLike,
} = require("../controllers/likeController");

const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: 게시글 및 댓글 좋아요 API
 */

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   post:
 *     summary: 게시글 좋아요 토글
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 좋아요 취소
 *       201:
 *         description: 게시글 좋아요 추가
 */
router.post("/posts/:postId/like", authMiddleware, togglePostLike);

/**
 * @swagger
 * /api/comments/{commentId}/like:
 *   post:
 *     summary: 댓글 좋아요 토글
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글 좋아요 취소
 *       201:
 *         description: 댓글 좋아요 추가
 */
router.post("/comments/:commentId/like", authMiddleware, toggleCommentLike);

module.exports = router;