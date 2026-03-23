const Document = require("../models/document.model");
const User = require("../models/user.model");

/**
 * ============================================================================
 * SCORE MANAGEMENT SERVICE
 * ============================================================================
 * Xử lý 4 yêu cầu:
 * 1. Quản lý Set Score — Admin set/thay đổi score kèm lịch sử
 * 2. Score thay đổi theo thời gian — Time Decay tự động
 * 3. Điểm theo tài liệu — Score tính từ views, favorites, downloads
 * 4. Điểm theo số loại tài liệu — Category diversity scoring
 * ============================================================================
 */

/**
 * 1. ADMIN SET SCORE — Thay đổi score và ghi lịch sử
 */
const setDocumentScore = async (
  documentId,
  newScore,
  adminUserId,
  reason = "",
) => {
  const doc = await Document.findById(documentId);
  if (!doc) throw new Error("Document not found");

  const previousScore = doc.score || 0;

  // Ghi lịch sử thay đổi
  doc.scoreHistory.push({
    previousScore,
    newScore,
    changedBy: adminUserId,
    reason: reason || `Score changed from ${previousScore} to ${newScore}`,
    changedAt: new Date(),
  });

  // Cập nhật score
  doc.score = newScore;

  // Tính lại dynamic score (bao gồm score mới)
  doc.calculateDynamicScore();

  await doc.save();
  return doc;
};

/**
 * 2. GET SCORE HISTORY — Xem lịch sử thay đổi score
 */
const getScoreHistory = async (documentId) => {
  const doc = await Document.findById(documentId)
    .populate("scoreHistory.changedBy", "fullName email")
    .select("title score scoreHistory dynamicScore lastScoreUpdate");

  if (!doc) throw new Error("Document not found");
  return doc;
};

/**
 * 3. RECALCULATE DOCUMENT SCORE — Tính lại điểm theo tài liệu
 * Gồm: views, favorites, downloads + time decay
 */
const recalculateDocumentScore = async (documentId) => {
  const doc = await Document.findById(documentId);
  if (!doc) throw new Error("Document not found");

  // Đếm số user đã favorite tài liệu này
  const favoriteCount = await User.countDocuments({ favorites: documentId });
  doc.dynamicScore = doc.dynamicScore || {};
  doc.dynamicScore.favoriteCount = favoriteCount;

  // Tính dynamic score
  doc.calculateDynamicScore();
  await doc.save();

  return doc;
};

/**
 * 4. RECALCULATE ALL SCORES — Tính lại tất cả (batch job)
 */
const recalculateAllScores = async () => {
  const docs = await Document.find({ status: "approved" });
  const results = [];

  for (const doc of docs) {
    // Đếm favorites cho từng doc
    const favoriteCount = await User.countDocuments({ favorites: doc._id });
    doc.dynamicScore = doc.dynamicScore || {};
    doc.dynamicScore.favoriteCount = favoriteCount;

    // Tính category diversity cho user upload
    const uploaderDocs = await Document.find({
      uploadedBy: doc.uploadedBy,
      status: "approved",
    }).select("category");

    const uniqueCategories = new Set(
      uploaderDocs
        .map((d) =>
          typeof d.category === "object"
            ? d.category?._id?.toString()
            : d.category?.toString(),
        )
        .filter(Boolean),
    );

    // Category diversity score: số loại tài liệu khác nhau * 3 điểm
    doc.dynamicScore.categoryDiversityScore = uniqueCategories.size * 3;

    doc.calculateDynamicScore();
    await doc.save();

    results.push({
      id: doc._id,
      title: doc.title,
      score: doc.score,
      dynamicScore: doc.dynamicScore.totalDynamicScore,
    });
  }

  return results;
};

/**
 * 5. GET SCORE ANALYTICS — Thống kê score toàn hệ thống
 */
const getScoreAnalytics = async () => {
  const docs = await Document.find({ status: "approved" })
    .populate("uploadedBy", "fullName")
    .populate("category", "name")
    .select(
      "title score dynamicScore views downloads category uploadedBy createdAt",
    )
    .sort({ "dynamicScore.totalDynamicScore": -1 });

  // Thống kê theo category
  const categoryStats = {};
  docs.forEach((doc) => {
    const catName =
      typeof doc.category === "object" ? doc.category?.name : "Uncategorized";
    const key = catName || "Uncategorized";
    if (!categoryStats[key]) {
      categoryStats[key] = {
        category: key,
        documentCount: 0,
        totalScore: 0,
        totalDynamicScore: 0,
        totalViews: 0,
        avgScore: 0,
      };
    }
    categoryStats[key].documentCount += 1;
    categoryStats[key].totalScore += doc.score || 0;
    categoryStats[key].totalDynamicScore +=
      doc.dynamicScore?.totalDynamicScore || 0;
    categoryStats[key].totalViews += doc.views || 0;
  });

  // Tính trung bình
  Object.values(categoryStats).forEach((stat) => {
    stat.avgScore =
      Math.round((stat.totalDynamicScore / stat.documentCount) * 100) / 100;
  });

  return {
    totalDocuments: docs.length,
    topDocuments: docs.slice(0, 10).map((d) => ({
      id: d._id,
      title: d.title,
      adminScore: d.score,
      dynamicScore: d.dynamicScore?.totalDynamicScore || 0,
      views: d.views,
      downloads: d.downloads,
      favorites: d.dynamicScore?.favoriteCount || 0,
      uploader: d.uploadedBy?.fullName,
      category: typeof d.category === "object" ? d.category?.name : null,
    })),
    categoryBreakdown: Object.values(categoryStats).sort(
      (a, b) => b.totalDynamicScore - a.totalDynamicScore,
    ),
  };
};

/**
 * 6. UPDATE SCORE ON INTERACTION — Cập nhật khi có tương tác mới
 * Gọi sau khi views đã được tăng bởi controller
 */
const updateScoreOnView = async (documentId) => {
  const doc = await Document.findById(documentId);
  if (!doc) return;

  // Tính lại dynamic score (views đã được $inc bởi controller)
  const favoriteCount = await User.countDocuments({ favorites: documentId });
  doc.dynamicScore = doc.dynamicScore || {};
  doc.dynamicScore.favoriteCount = favoriteCount;
  doc.calculateDynamicScore();

  await doc.save();
  return doc;
};

const updateScoreOnFavorite = async (documentId) => {
  const doc = await Document.findById(documentId);
  if (!doc) return;

  const favoriteCount = await User.countDocuments({ favorites: documentId });
  doc.dynamicScore = doc.dynamicScore || {};
  doc.dynamicScore.favoriteCount = favoriteCount;
  doc.calculateDynamicScore();

  await doc.save();
  return doc;
};

module.exports = {
  setDocumentScore,
  getScoreHistory,
  recalculateDocumentScore,
  recalculateAllScores,
  getScoreAnalytics,
  updateScoreOnView,
  updateScoreOnFavorite,
};
