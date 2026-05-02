const express = require("express");
const router = express.Router();

const {
  getSchoolNotices,
  getDepartmentNotices,
  getNoticeById,
  listNotices,
  syncNotices,
  syncSchoolNotices,
  syncSchoolCategory,
  syncDepartmentNotices,
  syncSingleDepartment,
  listSyncTargets,
} = require("../controllers/noticeController");

const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Notices
 *   description: 학교 및 학과 공지 조회/크롤링 API
 */

/**
 * @swagger
 * /api/notices:
 *   get:
 *     summary: 공지 목록 통합 조회
 *     tags: [Notices]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 제목/본문 검색어
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 공지 카테고리
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: 학교, 학과 또는 학과명
 *       - in: query
 *         name: notice_scope
 *         schema:
 *           type: string
 *           enum: [school, department]
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 20
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest]
 *     responses:
 *       200:
 *         description: 공지 목록 조회 성공
 */
router.get("/", listNotices);

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
 * /api/notices/sync-targets:
 *   get:
 *     summary: 크롤링 가능한 학교 카테고리/학과 목록 조회
 *     tags: [Notices]
 *     responses:
 *       200:
 *         description: 크롤링 대상 목록 조회 성공
 */
router.get("/sync-targets", listSyncTargets);

/**
 * @swagger
 * /api/notices/sync:
 *   post:
 *     summary: 전체 공지 크롤링 및 DB 저장
 *     tags: [Notices]
 *     description: 학교 공지와 전체 학과 공지를 크롤링한다. 새로 생성된 공지만 알림을 생성한다.
 *     responses:
 *       200:
 *         description: 전체 공지 크롤링 성공
 */
router.post("/sync", syncNotices);

/**
 * @swagger
 * /api/notices/sync/school:
 *   post:
 *     summary: 학교 공지 크롤링 및 DB 저장
 *     tags: [Notices]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: 일반, 학사, 교직 등 카테고리명
 *     responses:
 *       200:
 *         description: 학교 공지 크롤링 성공
 */
router.post("/sync/school", syncSchoolNotices);

/**
 * @swagger
 * /api/notices/sync/school/{categoryKey}:
 *   post:
 *     summary: 학교 카테고리별 공지 크롤링 및 DB 저장
 *     tags: [Notices]
 *     parameters:
 *       - in: path
 *         name: categoryKey
 *         required: true
 *         schema:
 *           type: string
 *         description: generalnotice 또는 일반 등
 *     responses:
 *       200:
 *         description: 학교 카테고리별 공지 크롤링 성공
 */
router.post("/sync/school/:categoryKey", syncSchoolCategory);

/**
 * @swagger
 * /api/notices/sync/department:
 *   post:
 *     summary: 학과 공지 크롤링 및 DB 저장
 *     tags: [Notices]
 *     parameters:
 *       - in: query
 *         name: department
 *         required: false
 *         schema:
 *           type: string
 *         description: 컴퓨터공학과, 영어영문학과 등 학과명
 *     responses:
 *       200:
 *         description: 학과 공지 크롤링 성공
 */
router.post("/sync/department", syncDepartmentNotices);
router.post("/sync/departments", syncDepartmentNotices);

/**
 * @swagger
 * /api/notices/sync/departments/{departmentKey}:
 *   post:
 *     summary: 특정 학과 공지 크롤링 및 DB 저장
 *     tags: [Notices]
 *     parameters:
 *       - in: path
 *         name: departmentKey
 *         required: true
 *         schema:
 *           type: string
 *         description: computer 또는 컴퓨터공학과 등
 *     responses:
 *       200:
 *         description: 특정 학과 공지 크롤링 성공
 */
router.post("/sync/departments/:departmentKey", syncSingleDepartment);

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
