const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoutes");
const commentRoutes = require("./commentRoutes");
const likeRoutes = require("./likeRoutes");
const noticeRoutes = require("./noticeRoutes");

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/", commentRoutes);
router.use("/", likeRoutes);
router.use("/notices", noticeRoutes);

module.exports = router;