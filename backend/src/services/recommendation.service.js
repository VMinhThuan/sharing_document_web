const Document = require("../models/document.model");
const User = require("../models/user.model");

/**
 * ============================================================================
 * HYBRID RECOMMENDATION SERVICE
 * ============================================================================
 * Thuật toán: Hybrid Weighted Cosine + Behavior Score + Time Decay
 *
 * Cải tiến so với thuật toán gốc:
 * 1. Weighted Cosine Similarity (thay vì Cosine gốc) - gán trọng số category/topics
 * 2. Time Decay Function (tham khảo SPIE 2025) - giảm trọng số theo thời gian
 * 3. Hybrid approach (tham khảo Preprints.org 2025) - kết hợp content + behavior + popularity
 * 4. User Profile Aggregation - tổng hợp từ favorites + recently viewed + uploads
 *
 * SCORE(user, doc) = α × ContentSim + β × BehaviorScore + γ × PopularityScore
 * Với α = 0.5, β = 0.35, γ = 0.15
 * ============================================================================
 */

// ===== CÁC HỆ SỐ CỦA THUẬT TOÁN =====
const WEIGHTS = {
  CONTENT: 0.5, // α - Content similarity weight
  BEHAVIOR: 0.35, // β - Behavior score weight
  POPULARITY: 0.15, // γ - Popularity score weight
};

// Trọng số cho các loại tương tác (Behavior)
const INTERACTION_WEIGHTS = {
  FAVORITE: 3.0,
  UPLOAD_SAME_CATEGORY: 2.0,
  VIEW: 1.0,
};

// Time Decay parameter (λ = 0.1 → half-life ≈ 7 ngày)
const DECAY_RATE = 0.1;

// Trọng số cho Weighted Cosine (quan trọng feature nào hơn)
const FEATURE_WEIGHTS = {
  CATEGORY_MATCH: 5.0, // Category match rất quan trọng
  TOPIC_OVERLAP: 3.0, // Topics overlap quan trọng
  SAME_UPLOADER: 1.5, // Cùng người upload
  FILE_TYPE_MATCH: 0.5, // Cùng loại file ít quan trọng
};

/**
 * ============================================================================
 * 1. WEIGHTED COSINE SIMILARITY (Cải tiến từ Cosine gốc)
 * ============================================================================
 * Thay vì dùng Cosine Similarity gốc (coi mọi feature bằng nhau),
 * ta gán trọng số cho từng feature dựa trên mức độ quan trọng.
 *
 * WCS(A, B) = Σ(wi × ai × bi) / √(Σ(wi × ai²) × Σ(wi × bi²))
 *
 * Cải tiến: Category match có trọng số 5.0, topic overlap có 3.0
 * → Gợi ý chính xác hơn so với cosine gốc treat mọi thứ bằng nhau
 */
const calculateContentSimilarity = (userProfile, document) => {
  let weightedDotProduct = 0;
  let weightedMagA = 0;
  let weightedMagB = 0;

  // Feature 1: Category Match (binary: 0 hoặc 1)
  const catA = userProfile.categoryIds.length > 0 ? 1 : 0;
  const docCatId =
    typeof document.category === "object"
      ? document.category?._id?.toString()
      : document.category?.toString();
  const catB = userProfile.categoryIds.includes(docCatId) ? 1 : 0;

  weightedDotProduct += FEATURE_WEIGHTS.CATEGORY_MATCH * catA * catB;
  weightedMagA += FEATURE_WEIGHTS.CATEGORY_MATCH * catA * catA;
  weightedMagB += FEATURE_WEIGHTS.CATEGORY_MATCH * catB * catB;

  // Feature 2: Topic Overlap (Jaccard-like: tỷ lệ topics trùng)
  const docTopics = document.aiAnalysis?.topics || [];
  const userTopics = userProfile.topics || [];
  let topicOverlap = 0;
  if (docTopics.length > 0 && userTopics.length > 0) {
    const docTopicsLower = docTopics.map((t) => t.toLowerCase());
    const userTopicsLower = userTopics.map((t) => t.toLowerCase());
    const intersection = docTopicsLower.filter((t) =>
      userTopicsLower.some(
        (ut) =>
          ut.includes(t) ||
          t.includes(ut) ||
          levenshteinSimilarity(t, ut) > 0.6,
      ),
    );
    topicOverlap =
      intersection.length /
      Math.max(docTopicsLower.length, userTopicsLower.length);
  }

  weightedDotProduct += FEATURE_WEIGHTS.TOPIC_OVERLAP * topicOverlap * 1;
  weightedMagA += FEATURE_WEIGHTS.TOPIC_OVERLAP * 1 * 1;
  weightedMagB += FEATURE_WEIGHTS.TOPIC_OVERLAP * topicOverlap * topicOverlap;

  // Feature 3: Same Uploader preference
  const sameUploader = userProfile.uploadedByIds.includes(
    document.uploadedBy?.toString(),
  )
    ? 1
    : 0;

  weightedDotProduct += FEATURE_WEIGHTS.SAME_UPLOADER * 1 * sameUploader;
  weightedMagA += FEATURE_WEIGHTS.SAME_UPLOADER * 1 * 1;
  weightedMagB += FEATURE_WEIGHTS.SAME_UPLOADER * sameUploader * sameUploader;

  // Feature 4: File Type preference
  const fileTypeMatch = userProfile.fileTypes.includes(document.fileType)
    ? 1
    : 0;

  weightedDotProduct += FEATURE_WEIGHTS.FILE_TYPE_MATCH * 1 * fileTypeMatch;
  weightedMagA += FEATURE_WEIGHTS.FILE_TYPE_MATCH * 1 * 1;
  weightedMagB +=
    FEATURE_WEIGHTS.FILE_TYPE_MATCH * fileTypeMatch * fileTypeMatch;

  // Tính Weighted Cosine Similarity
  const denominator = Math.sqrt(weightedMagA) * Math.sqrt(weightedMagB);
  if (denominator === 0) return 0;

  return weightedDotProduct / denominator;
};

/**
 * ============================================================================
 * 2. BEHAVIOR SCORE + TIME DECAY (Cải tiến từ bài báo SPIE 2025)
 * ============================================================================
 * BehaviorScore = Σ(interaction_weight × e^(-λt))
 *
 * Cải tiến: Thêm Time Decay Function (e^(-λt)) thay vì đếm đơn giản
 * → Tài liệu tương tác gần đây được ưu tiên hơn tài liệu cũ
 * → λ = 0.1: half-life ≈ 7 ngày (sau 7 ngày, ảnh hưởng giảm ~50%)
 */
const calculateBehaviorScore = (userProfile, document) => {
  let score = 0;
  const now = new Date();
  const docId = document._id.toString();

  // Favorite interaction
  if (userProfile.favoriteIds.includes(docId)) {
    score += INTERACTION_WEIGHTS.FAVORITE;
  }

  // Recently viewed interaction (with time decay)
  const recentView = userProfile.recentlyViewed.find(
    (rv) => rv.document?.toString() === docId,
  );
  if (recentView) {
    const daysSinceView =
      (now - new Date(recentView.viewedAt)) / (1000 * 60 * 60 * 24);
    const timeDecay = Math.exp(-DECAY_RATE * daysSinceView);
    score += INTERACTION_WEIGHTS.VIEW * timeDecay;
  }

  // Upload same category (boost for documents in categories user uploads to)
  const docCatId =
    typeof document.category === "object"
      ? document.category?._id?.toString()
      : document.category?.toString();
  if (userProfile.uploadedCategoryIds.includes(docCatId)) {
    score += INTERACTION_WEIGHTS.UPLOAD_SAME_CATEGORY;
  }

  // Normalize to [0, 1]
  const maxPossibleScore =
    INTERACTION_WEIGHTS.FAVORITE +
    INTERACTION_WEIGHTS.VIEW +
    INTERACTION_WEIGHTS.UPLOAD_SAME_CATEGORY;
  return Math.min(score / maxPossibleScore, 1);
};

/**
 * ============================================================================
 * 3. POPULARITY SCORE (Cải tiến từ bài báo PLOS ONE 2025)
 * ============================================================================
 * PopularityScore = log(1 + views) × recency_boost + dynamicScore bonus
 *
 * Cải tiến: Dùng log để giảm ảnh hưởng của tài liệu quá phổ biến (popularity bias)
 * + recency_boost ưu tiên tài liệu mới hơn
 * + tích hợp dynamicScore (admin score + engagement)
 */
const calculatePopularityScore = (document, maxViews) => {
  const now = new Date();
  const docAge = (now - new Date(document.createdAt)) / (1000 * 60 * 60 * 24); // days

  // Log-scaled view count (tránh popularity bias)
  const viewScore = Math.log(1 + (document.views || 0));
  const maxViewScore = Math.log(1 + maxViews);
  const normalizedViews = maxViewScore > 0 ? viewScore / maxViewScore : 0;

  // Recency boost: tài liệu mới hơn được boost nhẹ
  const recencyBoost = Math.exp(-0.01 * docAge); // Decay rất chậm (half-life ≈ 70 ngày)

  // Dynamic score bonus (từ hệ thống scoring)
  const totalDynamic = document.dynamicScore?.totalDynamicScore || 0;
  const dynamicBonus = Math.min(totalDynamic / 100, 0.3); // Cap ở 0.3

  return normalizedViews * 0.5 + recencyBoost * 0.2 + dynamicBonus;
};

/**
 * ============================================================================
 * HELPER: Levenshtein Similarity (cho topic matching mềm)
 * ============================================================================
 */
const levenshteinSimilarity = (a, b) => {
  if (a.length === 0) return b.length === 0 ? 1 : 0;
  if (b.length === 0) return 0;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  const maxLen = Math.max(a.length, b.length);
  return 1 - matrix[b.length][a.length] / maxLen;
};

/**
 * ============================================================================
 * BUILD USER PROFILE
 * ============================================================================
 * Tổng hợp thông tin từ: favorites, recently viewed, uploaded documents
 * để xây dựng "hồ sơ sở thích" của user
 */
const buildUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .populate({
      path: "favorites",
      select: "category aiAnalysis fileType uploadedBy",
    })
    .populate({
      path: "recentlyViewed.document",
      select: "category aiAnalysis fileType uploadedBy",
    });

  if (!user) throw new Error("User not found");

  // Lấy documents user đã upload
  const uploadedDocs = await Document.find(
    { uploadedBy: userId, status: "approved" },
    "category aiAnalysis fileType",
  );

  // Tổng hợp categories từ favorites + recently viewed + uploads
  const categoryIds = new Set();
  const topics = [];
  const fileTypes = new Set();
  const uploadedByIds = new Set();
  const uploadedCategoryIds = new Set();
  const favoriteIds = new Set();

  // Từ favorites
  (user.favorites || []).forEach((doc) => {
    if (!doc) return;
    favoriteIds.add(doc._id.toString());
    const catId =
      typeof doc.category === "object"
        ? doc.category?._id?.toString()
        : doc.category?.toString();
    if (catId) categoryIds.add(catId);
    (doc.aiAnalysis?.topics || []).forEach((t) => topics.push(t));
    if (doc.fileType) fileTypes.add(doc.fileType);
    if (doc.uploadedBy) uploadedByIds.add(doc.uploadedBy.toString());
  });

  // Từ recently viewed
  (user.recentlyViewed || []).forEach((rv) => {
    const doc = rv.document;
    if (!doc) return;
    const catId =
      typeof doc.category === "object"
        ? doc.category?._id?.toString()
        : doc.category?.toString();
    if (catId) categoryIds.add(catId);
    (doc.aiAnalysis?.topics || []).forEach((t) => topics.push(t));
    if (doc.fileType) fileTypes.add(doc.fileType);
  });

  // Từ uploaded docs
  uploadedDocs.forEach((doc) => {
    const catId =
      typeof doc.category === "object"
        ? doc.category?._id?.toString()
        : doc.category?.toString();
    if (catId) {
      categoryIds.add(catId);
      uploadedCategoryIds.add(catId);
    }
    (doc.aiAnalysis?.topics || []).forEach((t) => topics.push(t));
    if (doc.fileType) fileTypes.add(doc.fileType);
  });

  return {
    categoryIds: [...categoryIds],
    topics: [...new Set(topics)], // Unique topics
    fileTypes: [...fileTypes],
    uploadedByIds: [...uploadedByIds],
    uploadedCategoryIds: [...uploadedCategoryIds],
    favoriteIds: [...favoriteIds],
    recentlyViewed: user.recentlyViewed || [],
    interests: (user.interests || []).map((i) => i.toString()),
  };
};

/**
 * ============================================================================
 * MAIN: GET PERSONALIZED RECOMMENDATIONS
 * ============================================================================
 * Kết hợp 3 thành phần:
 * SCORE = α × ContentSim + β × BehaviorScore + γ × PopularityScore
 */
const getRecommendations = async (userId, limit = 6, page = 1) => {
  const skip = (page - 1) * limit;

  // 1. Build User Profile
  const userProfile = await buildUserProfile(userId);

  // 2. Lấy tất cả tài liệu đã duyệt (trừ tài liệu user tự upload)
  const allDocs = await Document.find({
    status: "approved",
    uploadedBy: { $ne: userId },
  })
    .populate("uploadedBy", "fullName avatar")
    .populate("category", "name")
    .sort({ createdAt: -1 });

  if (allDocs.length === 0) {
    return {
      docs: [],
      total: 0,
      page: Number(page),
      pages: 0,
    };
  }

  // Nếu user chưa có tương tác → trả về tài liệu mới nhất + phổ biến
  const hasInteractions =
    userProfile.categoryIds.length > 0 ||
    userProfile.favoriteIds.length > 0 ||
    userProfile.recentlyViewed.length > 0;

  if (!hasInteractions) {
    const total = allDocs.length;
    const docs = allDocs.slice(skip, skip + limit);
    return {
      docs,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    };
  }

  // 3. Tính max views cho normalization
  const maxViews = Math.max(...allDocs.map((d) => d.views || 0), 1);

  // 4. Tính HYBRID SCORE cho từng tài liệu
  const scoredDocs = allDocs.map((doc) => {
    const contentSim = calculateContentSimilarity(userProfile, doc);
    const behaviorScore = calculateBehaviorScore(userProfile, doc);
    const popularityScore = calculatePopularityScore(doc, maxViews);

    const docCatId =
      typeof doc.category === "object"
        ? doc.category?._id?.toString()
        : doc.category?.toString();
    const interestBoost = userProfile.interests.includes(docCatId) ? 0.1 : 0;

    const finalScore =
      WEIGHTS.CONTENT * contentSim +
      WEIGHTS.BEHAVIOR * behaviorScore +
      WEIGHTS.POPULARITY * popularityScore +
      interestBoost;

    return {
      document: doc,
      score: finalScore,
    };
  });

  // 5. Lọc bỏ tài liệu đã xem gần đây
  const recentViewedIds = userProfile.recentlyViewed.map((rv) =>
    rv.document?.toString(),
  );
  const filteredDocs = scoredDocs.filter(
    (sd) => !recentViewedIds.includes(sd.document._id.toString()),
  );

  // 6. Sắp xếp theo score giảm dần
  filteredDocs.sort((a, b) => b.score - a.score);

  // 7. Đa dạng hóa
  const diversified = [];
  const categoryCounts = {};

  for (const item of filteredDocs) {
    const catId =
      typeof item.document.category === "object"
        ? item.document.category?._id?.toString()
        : item.document.category?.toString();

    const catKey = catId || "none";
    categoryCounts[catKey] = (categoryCounts[catKey] || 0) + 1;

    if (categoryCounts[catKey] <= 3) {
      // Tăng lên 3 cho đa dạng hơn khi lấy nhiều
      diversified.push(item);
    }
  }

  const total = diversified.length;
  const paginatedResults = diversified.slice(skip, skip + limit);

  const docs = paginatedResults.map((item) => ({
    ...item.document.toObject(),
    _recommendationScore: item.score,
    _matchPercentage: Math.round(
      Math.min(item.score * 100 + 50, 99), // Scale to display: 50-99%
    ),
  }));

  return {
    docs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

module.exports = {
  getRecommendations,
  // Export cho testing
  calculateContentSimilarity,
  calculateBehaviorScore,
  calculatePopularityScore,
  buildUserProfile,
};
