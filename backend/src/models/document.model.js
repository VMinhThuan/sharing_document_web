const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  fileUrl: {
    type: String,
    required: [true, "Please add a file URL"],
  },
  fileType: {
    type: String,
    required: true,
  },
  size: {
    type: Number, // in bytes
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  score: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  // AI Analysis fields
  aiAnalysis: {
    aiSummary: {
      type: String,
      default: "",
    },
    topics: [
      {
        type: String,
      },
    ],
    policyViolation: {
      hasViolation: {
        type: Boolean,
        default: false,
      },
      violationType: {
        type: String,
        default: null,
      },
      reason: {
        type: String,
        default: null,
      },
    },
    isEducational: {
      type: Boolean,
      default: true,
    },
    recommendedCategory: {
      type: String,
      default: "General",
    },
    analyzedAt: {
      type: Date,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
