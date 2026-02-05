const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Admin only: Get all comments in system
router.get("/", protect, authorize("admin"), commentController.getComments);

// Authenticated users:
router.post("/", protect, commentController.createComment);
router.get("/document/:documentId", commentController.getDocumentComments);
router.delete("/:id", protect, commentController.deleteComment);
router.put("/:id", protect, commentController.updateComment);

module.exports = router;
