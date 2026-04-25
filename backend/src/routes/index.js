const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoutes");
const commentRoutes = require("./commentRoutes");

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/", commentRoutes);

module.exports = router;