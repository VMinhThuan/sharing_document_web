const express = require("express");
const router = express.Router();
const documentController = require("../controllers/document.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const { upload } = require("../configs/cloudinary");
// Routes for documents
router.post(
  "/",
  protect,
  authorize("admin", "user"),
  upload.single("file"),
  documentController.createDocument,
);
router.get(
  "/search",
  protect,
  authorize("admin", "user"),
  documentController.searchDocuments,
);
router.get(
  "/me",
  protect,
  authorize("admin", "user"),
  documentController.getMyDocuments,
);
router.get(
  "/favorites",
  protect,
  authorize("admin", "user"),
  documentController.getFavorites,
);
router.post(
  "/favorites/:id",
  protect,
  authorize("admin", "user"),
  documentController.toggleFavorite,
);
router.get(
  "/recent",
  protect,
  authorize("admin", "user"),
  documentController.getRecentlyViewed,
);
router.post(
  "/recent/:id",
  protect,
  authorize("admin", "user"),
  documentController.addRecentlyViewed,
);
router.get("/trending", documentController.getTrendingDocuments);
router.get(
  "/recommendations",
  protect,
  authorize("admin", "user"),
  documentController.getRecommendations,
);

// ===== SCORE MANAGEMENT ROUTES (phải đứng TRƯỚC /:id) =====
// Batch recalculate tất cả score (admin)
router.post(
  "/scores/recalculate",
  protect,
  authorize("admin"),
  documentController.recalculateAllScores,
);
// Thống kê score toàn hệ thống (admin)
router.get(
  "/scores/analytics",
  protect,
  authorize("admin"),
  documentController.getScoreAnalytics,
);

router.get(
  "/:id",
  protect,
  authorize("admin", "user"),
  documentController.getDocument,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  documentController.updateDocument,
);
// For now, assuming these are mostly admin actions as per previous context, but structure allows extension
router.get(
  "/",
  protect,
  authorize("admin", "user"),
  documentController.getDocuments,
); // Users might see public docs, admin sees all? logic needed later

// Proxy route for viewing documents (bypassing CORS/Cloudinary headers)
router.get(
  "/view/:id",
  protect,
  authorize("admin", "user"),
  documentController.viewDocument,
);

router.post(
  "/download/:id",
  protect,
  authorize("admin", "user"),
  documentController.recordDownload,
);

router.put(
  "/:id/approve",
  protect,
  authorize("admin"),
  documentController.approveDocument,
);
router.put(
  "/:id/reject",
  protect,
  authorize("admin"),
  documentController.rejectDocument,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  documentController.deleteDocument,
);

// Admin set score cho document
router.put(
  "/:id/score",
  protect,
  authorize("admin"),
  documentController.setDocumentScore,
);
// Xem lịch sử thay đổi score
router.get(
  "/:id/score-history",
  protect,
  authorize("admin"),
  documentController.getScoreHistory,
);

module.exports = router;
