const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const { protect } = require("../middlewares/auth.middleware");
const { upload } = require("../configs/cloudinary");

// Allow authenticated users (users & admins) to upload files
router.post("/", protect, upload.single("file"), uploadController.uploadFile);

module.exports = router;
