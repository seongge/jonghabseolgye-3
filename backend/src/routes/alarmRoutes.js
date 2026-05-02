const express = require("express");
const router = express.Router();
const { getMyAlarms, deleteMyAlarm } = require("../controllers/alarmController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Alarms
 *   description: 알림 조회 및 확인 API
 */

/**
 * @swagger
 * /api/alarms:
 *   get:
 *     summary: 내 알림 목록 조회
 *     tags: [Alarms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 알림 목록 조회 성공
 *       401:
 *         description: 인증 실패
 */
router.get("/", authMiddleware, getMyAlarms);

/**
 * @swagger
 * /api/alarms/{alarmId}:
 *   delete:
 *     summary: 알림 확인 후 삭제
 *     tags: [Alarms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alarmId
 *         required: true
 *         schema:
 *           type: string
 *         description: 알림 ID
 *     responses:
 *       200:
 *         description: 알림 확인 처리 및 삭제 성공
 *       404:
 *         description: 삭제할 알림 없음 또는 본인 알림 아님
 */
router.delete("/:alarmId", authMiddleware, deleteMyAlarm);

module.exports = router;
