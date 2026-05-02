const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 자유게시판 및 전공게시판 게시글 API
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: 게시글 작성
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     description: 자유 게시판 또는 전공 게시판에 게시글을 작성한다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - board_type
 *               - title
 *               - content
 *             properties:
 *               board_type:
 *                 type: string
 *                 enum: [free, major]
 *                 example: major
 *               title:
 *                 type: string
 *                 example: 전공 게시판 테스트
 *               content:
 *                 type: string
 *                 example: 전공 게시판 글입니다.
 *               grade_filter:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [2, 3]
 *     responses:
 *       201:
 *         description: 게시글 작성 성공
 *       400:
 *         description: 요청값 오류
 *       401:
 *         description: 인증 실패
 */
router.post("/", authMiddleware, createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: board_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [free, major]
 *         description: 게시판 타입
 *       - in: query
 *         name: grade
 *         required: false
 *         schema:
 *           type: number
 *         description: 전공 게시판 학년 필터
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 */
router.get("/", authMiddleware, getPosts);

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: 게시글 상세 조회
 *     tags: [Posts]
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
 *         description: 게시글 상세 조회 성공
 *       403:
 *         description: 전공 게시판 접근 권한 없음
 *       404:
 *         description: 게시글 없음
 */
router.get("/:postId", authMiddleware, getPostById);

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: 게시글 수정
 *     tags: [Posts]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: 수정된 제목
 *               content:
 *                 type: string
 *                 example: 수정된 내용입니다.
 *               grade_filter:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [2, 4]
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *       403:
 *         description: 작성자 권한 없음
 */
router.put("/:postId", authMiddleware, updatePost);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Posts]
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
 *         description: 게시글 삭제 성공
 *       403:
 *         description: 작성자 권한 없음
 */
router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;