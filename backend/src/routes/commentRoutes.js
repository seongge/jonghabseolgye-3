const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 API
 */

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: 댓글 작성
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: 댓글 작성 테스트입니다.
 *     responses:
 *       201:
 *         description: 댓글 작성 성공
 */
router.post("/posts/:postId/comments", authMiddleware, createComment);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: 댓글 목록 조회
 *     tags: [Comments]
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
 *         description: 댓글 목록 조회 성공
 */
router.get("/posts/:postId/comments", authMiddleware, getCommentsByPost);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   put:
 *     summary: 댓글 수정
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: 수정된 댓글 내용입니다.
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *       403:
 *         description: 작성자 권한 없음
 */
router.put("/comments/:commentId", authMiddleware, updateComment);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
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
 *         description: 댓글 삭제 성공
 *       403:
 *         description: 작성자 권한 없음
 */
router.delete("/comments/:commentId", authMiddleware, deleteComment);

module.exports = router;