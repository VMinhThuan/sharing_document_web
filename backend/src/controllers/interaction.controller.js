const Interaction = require("../models/interaction.model");
const Document = require("../models/document.model");
const catchAsync = require("../utils/catchAsync"); 
const AppError = require("../utils/appError");
const { successResponse, errorResponse } = require("../utils/response");

// Ghi nhận một tương tác (view, download, favorite)
exports.recordInteraction = catchAsync(async (req, res, next) => {
  const { documentId, action, duration } = req.body;
  const userId = req.user.id;

  // 1. Tạo bản ghi interaction mới
  const interaction = await Interaction.create({
    user: userId,
    document: documentId,
    action,
    duration,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // 2. Cập nhật thống kê trong Document model (nếu cần)
  const updateQuery = {};
  if (action === "view") updateQuery.$inc = { views: 1 };
  if (action === "download") updateQuery.$inc = { downloads: 1 };
  
  if (Object.keys(updateQuery).length > 0) {
    const doc = await Document.findByIdAndUpdate(documentId, updateQuery, { new: true });
    
    // Tự động tính lại dynamic score khi có tương tác mới
    if (doc && doc.calculateDynamicScore) {
       await doc.calculateDynamicScore();
       await doc.save();
    }
  }

  successResponse(res, 201, "Interaction recorded", { interaction });
});

// Lấy lịch sử tương tác của người dùng hiện tại
exports.getMyInteractions = catchAsync(async (req, res, next) => {
  const interactions = await Interaction.find({ user: req.user.id })
    .populate("document", "title fileType thumbnail")
    .sort("-timestamp");

  successResponse(res, 200, "Your interactions retrieved", {
    interactions,
    results: interactions.length,
  });
});
