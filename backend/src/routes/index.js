const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const alarmRoutes = require("./alarmRoutes");

router.use("/auth", authRoutes);
router.use("/alarms", alarmRoutes);

module.exports = router;