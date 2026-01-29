const express = require("express");
const router = express.Router();
const documentController = require("../controllers/document.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const { upload } = require("../configs/cloudinary");
// Routes for documents
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("file"),
  documentController.createDocument,
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

module.exports = router;
