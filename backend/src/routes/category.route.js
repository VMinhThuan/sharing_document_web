const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Public: Get all categories (needed for upload forms etc)
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

// Admin only: Create, Update, Delete
router.post(
  "/",
  protect,
  authorize("admin"),
  categoryController.createCategory,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  categoryController.deleteCategory,
);

module.exports = router;
