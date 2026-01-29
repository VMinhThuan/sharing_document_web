const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Protect all routes
router.use(protect);
router.use(authorize("admin"));

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id/toggle-status", userController.toggleUserStatus);

module.exports = router;
