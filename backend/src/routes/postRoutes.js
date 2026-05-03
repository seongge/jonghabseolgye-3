const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  getMyPosts,
  getLikedPosts,
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
 */
router.get("/", authMiddleware, getPosts);

/**
 * @swagger
 * /api/posts/my:
 *   get:
 *     summary: 내가 작성한 게시글 목록 조회
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.get("/my", authMiddleware, getMyPosts);

/**
 * @swagger
 * /api/posts/liked:
 *   get:
 *     summary: 내가 좋아요 표시한 게시글 목록 조회
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.get("/liked", authMiddleware, getLikedPosts);

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: 게시글 상세 조회
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
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
 */
router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;
