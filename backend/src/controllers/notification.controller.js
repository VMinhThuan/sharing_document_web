const Notification = require("../models/notification.model");
const catchAsync = require("../utils/catchAsync");
const { successResponse, errorResponse } = require("../utils/response");

// Lấy danh sách thông báo của người dùng hiện tại
exports.getMyNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort("-createdAt")
    .populate("sender", "fullName avatar");

  successResponse(res, 200, "Your notifications retrieved", {
    notifications,
    results: notifications.length,
  });
});

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true }
  );

  successResponse(res, 200, "Tất cả thông báo đã được đánh dấu là đã đọc");
});
