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
  // ===== SCORING SYSTEM =====
  // Điểm điều chỉnh từ admin (bonus/penalty) — KHÔNG set khi tạo, chỉ điều chỉnh sau
  score: {
    type: Number,
    default: 0, // Luôn bắt đầu = 0, tự động tính bởi dynamic scoring
  },
  // Lịch sử thay đổi score (theo dõi ai thay đổi, khi nào, giá trị)
  scoreHistory: [
    {
      previousScore: { type: Number },
      newScore: { type: Number },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reason: { type: String, default: "" },
      changedAt: { type: Date, default: Date.now },
    },
  ],
  // Dynamic Score - tự động tính theo tương tác & thời gian
  dynamicScore: {
    // Điểm theo lượt xem: log(1 + views) * 10
    viewScore: { type: Number, default: 0 },
    // Điểm theo lượt favorite
    favoriteCount: { type: Number, default: 0 },
    favoriteScore: { type: Number, default: 0 },
    // Điểm theo lượt download
    downloadScore: { type: Number, default: 0 },
    // Điểm tương tác tổng hợp (engagement)
    engagementScore: { type: Number, default: 0 },
    // Điểm theo số loại tài liệu (category diversity) - user upload đa dạng thể loại
    categoryDiversityScore: { type: Number, default: 0 },
    // Điểm suy giảm theo thời gian (time decay)
    timeDecayScore: { type: Number, default: 0 },
    // Tổng điểm dynamic
    totalDynamicScore: { type: Number, default: 0 },
  },
  // Thời điểm cập nhật score cuối
  lastScoreUpdate: {
    type: Date,
    default: null,
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

/**
 * Tính Dynamic Score cho tài liệu
 * Công thức: totalDynamicScore = viewScore + favoriteScore + downloadScore + timeDecayBonus
 *
 * - viewScore = log(1 + views) * 10            → max ~40 (tại 10,000 views)
 * - favoriteScore = favoriteCount * 5           → 5 điểm mỗi favorite
 * - downloadScore = log(1 + downloads) * 8      → max ~32
 * - engagementScore = (views>0 ? 5 : 0) + (favoriteCount>0 ? 10 : 0) + (downloads>0 ? 8 : 0)
 * - timeDecayScore = baseScore * e^(-0.005 * dayAge)  → suy giảm chậm (half-life ~139 ngày)
 */
documentSchema.methods.calculateDynamicScore = function () {
  const now = new Date();
  const dayAge = (now - new Date(this.createdAt)) / (1000 * 60 * 60 * 24);

  // 1. Điểm theo lượt xem (log-scaled)
  const viewScore =
    Math.round(Math.log(1 + (this.views || 0)) * 10 * 100) / 100;

  // 2. Điểm theo lượt favorite
  const favCount = this.dynamicScore?.favoriteCount || 0;
  const favoriteScore = favCount * 5;

  // 3. Điểm theo lượt download (log-scaled)
  const downloadScore =
    Math.round(Math.log(1 + (this.downloads || 0)) * 8 * 100) / 100;

  // 4. Điểm engagement (có tương tác hay không)
  const engagementScore =
    ((this.views || 0) > 0 ? 5 : 0) +
    (favCount > 0 ? 10 : 0) +
    ((this.downloads || 0) > 0 ? 8 : 0);

  // 5. Time decay (suy giảm chậm theo thời gian)
  const baseScore = viewScore + favoriteScore + downloadScore + engagementScore;
  const timeDecayFactor = Math.exp(-0.005 * dayAge);
  const timeDecayScore = Math.round(baseScore * timeDecayFactor * 100) / 100;

  // Cập nhật
  this.dynamicScore = {
    viewScore,
    favoriteCount: favCount,
    favoriteScore,
    downloadScore,
    engagementScore,
    categoryDiversityScore: this.dynamicScore?.categoryDiversityScore || 0,
    timeDecayScore,
    totalDynamicScore:
      Math.round((timeDecayScore + (this.score || 0)) * 100) / 100,
  };
  this.lastScoreUpdate = now;

  return this.dynamicScore;
};

module.exports = mongoose.model("Document", documentSchema);
