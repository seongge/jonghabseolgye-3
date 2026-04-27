const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoutes");
const commentRoutes = require("./commentRoutes");
const likeRoutes = require("./likeRoutes");

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/", commentRoutes);
router.use("/", likeRoutes);

module.exports = router;