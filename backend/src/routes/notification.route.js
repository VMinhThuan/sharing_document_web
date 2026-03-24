const express = require("express");
const notificationController = require("../controllers/notification.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/", notificationController.getMyNotifications);
router.put("/mark-all-read", notificationController.markAllAsRead);

module.exports = router;
