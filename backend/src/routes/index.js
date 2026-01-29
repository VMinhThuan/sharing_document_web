const express = require("express");
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const documentRoutes = require("./document.route");
const dashboardRoutes = require("./dashboard.route");
const categoryRoutes = require("./category.route");
const commentRoutes = require("./comment.route");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/documents", documentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/categories", categoryRoutes);
router.use("/comments", commentRoutes);
router.use("/upload", require("./upload.route"));

module.exports = router;
