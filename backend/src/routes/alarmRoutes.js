const express = require("express");
const router = express.Router();
const alarmController = require("../controllers/alarmController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, alarmController.getMyAlarms);
router.delete("/:alarmId", protect, alarmController.deleteMyAlarm);

module.exports = router;
