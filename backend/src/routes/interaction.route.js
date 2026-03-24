const express = require("express");
const interactionController = require("../controllers/interaction.controller");
const { protect } = require("../middlewares/auth.middleware"); // Assuming this middleware exists

const router = express.Router();

// Tất cả các route interact đều yêu cầu login
router.use(protect);

router.post("/", interactionController.recordInteraction);
router.get("/my-history", interactionController.getMyInteractions);

module.exports = router;
