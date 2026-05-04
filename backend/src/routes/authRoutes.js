const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 사용자 인증 API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nickname
 *               - grade
 *               - major
 *               - student_number
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               nickname:
 *                 type: string
 *                 example: 신은수
 *               grade:
 *                 type: number
 *                 example: 4
 *               major:
 *                 type: string
 *                 example: 컴퓨터공학과
 *               student_number:
 *                 type: string
 *                 example: "20211234"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       400:
 *         description: 필수 입력값 누락
 *       409:
 *         description: 이메일 또는 학번 중복
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: 로그인 성공 및 JWT 토큰 발급
 *       401:
 *         description: 이메일 또는 비밀번호 오류
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 내 정보 조회 성공
 *       401:
 *         description: 인증 실패
 */
router.get("/me", authMiddleware, getMe);

module.exports = router;