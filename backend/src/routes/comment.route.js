const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

router.get("/", protect, authorize("admin"), commentController.getComments);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  commentController.deleteComment,
);

module.exports = router;
