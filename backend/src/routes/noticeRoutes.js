const express = require("express");
const router = express.Router();

const {
  getSchoolNotices,
  getDepartmentNotices,
  getNoticeById,
} = require("../controllers/noticeController");

const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Notices
 *   description: 학교 및 학과 공지 조회 API
 */

/**
 * @swagger
 * /api/notices/school:
 *   get:
 *     summary: 학교 공지 목록 조회
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: 공지 카테고리
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         description: 검색어
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *           example: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *           example: 20
 *         description: 페이지당 조회 개수
 *     responses:
 *       200:
 *         description: 학교 공지 목록 조회 성공
 */
router.get("/school", authMiddleware, getSchoolNotices);

/**
 * @swagger
 * /api/notices/department:
 *   get:
 *     summary: 내 학과 공지 목록 조회
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: 공지 카테고리
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         description: 검색어
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *           example: 20
 *     responses:
 *       200:
 *         description: 학과 공지 목록 조회 성공
 */
router.get("/department", authMiddleware, getDepartmentNotices);

/**
 * @swagger
 * /api/notices/{noticeId}:
 *   get:
 *     summary: 공지 상세 조회
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noticeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 공지 ID
 *     responses:
 *       200:
 *         description: 공지 상세 조회 성공
 *       403:
 *         description: 학과 공지 접근 권한 없음
 *       404:
 *         description: 공지 없음
 */
router.get("/:noticeId", authMiddleware, getNoticeById);

module.exports = router;