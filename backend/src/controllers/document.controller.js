const documentService = require("../services/document.service");
const userService = require("../services/user.service");
const aiService = require("../services/ai.service");
const documentParserService = require("../services/documentParser.service");
const recommendationService = require("../services/recommendation.service");
const scoreService = require("../services/score.service");
const Document = require("../models/document.model");
const { successResponse, errorResponse } = require("../utils/response");
const axios = require("axios");

const getDocuments = async (req, res) => {
  try {
    const { status, limit, page } = req.query;
    const result = await documentService.getDocuments(
      status,
      parseInt(limit) || 10,
      parseInt(page) || 1,
    );
    successResponse(res, 200, "Documents retrieved", result);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const getMyDocuments = async (req, res) => {
  try {
    const { status, limit, page } = req.query;
    const result = await documentService.getUserDocuments(
      req.user._id,
      status,
      parseInt(limit) || 10,
      parseInt(page) || 1,
    );
    successResponse(res, 200, "Your documents retrieved", result);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorites = await userService.toggleFavorite(req.user._id, id);
    // Cập nhật dynamic score khi favorite thay đổi
    scoreService
      .updateScoreOnFavorite(id)
      .catch((err) =>
        console.error("Score update on favorite failed:", err.message),
      );
    successResponse(res, 200, "Favorite toggled", favorites);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const getFavorites = async (req, res) => {
  try {
    const docs = await userService.getFavorites(req.user._id);
    successResponse(res, 200, "Favorite documents retrieved", docs);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const getDocument = async (req, res) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id);
    if (!doc) {
      return errorResponse(res, 404, "Document not found");
    }
    successResponse(res, 200, "Document retrieved", doc);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const approveDocument = async (req, res) => {
  try {
    const doc = await documentService.approveDocument(req.params.id);
    successResponse(res, 200, "Document approved", doc);
  } catch (error) {
    errorResponse(res, 400, "Action failed", error.message);
  }
};

const rejectDocument = async (req, res) => {
  try {
    const doc = await documentService.rejectDocument(req.params.id);
    successResponse(res, 200, "Document rejected", doc);
  } catch (error) {
    errorResponse(res, 400, "Action failed", error.message);
  }
};

const deleteDocument = async (req, res) => {
  try {
    await documentService.deleteDocument(req.params.id);
    successResponse(res, 200, "Document deleted");
  } catch (error) {
    errorResponse(res, 400, "Action failed", error.message);
  }
};

const createDocument = async (req, res) => {
  try {
    const { title, description, category, fileUrl, type, size } = req.body;

    let docFileUrl = "";
    let docFileType = "unknown";
    let docSize = 0;

    if (req.file) {
      // Old way: file uploaded in this request
      console.log("File Uploaded to Cloudinary:", req.file); // DEBUG LOG
      docFileUrl = req.file.path;
      docFileType = req.file.mimetype.split("/")[1] || "unknown";
      docSize = req.file.size;
    } else if (fileUrl) {
      // New way: file uploaded separately, url passed in body
      docFileUrl = fileUrl;
      // If client sends type/size, use them, otherwise infer or 0
      docFileType = type || "unknown"; // Client should send this
      docSize = size || 0;
    } else {
      return errorResponse(res, 400, "Please upload a file or provide fileUrl");
    }

    // Construct document data — Score luôn bắt đầu = 0, tự động tính bởi scoring system
    const docData = {
      title,
      description,
      category:
        category && category.match(/^[0-9a-fA-F]{24}$/) ? category : undefined,
      score: 0, // Score không được set thủ công khi tạo, phải tự động tính
      fileUrl: docFileUrl,
      fileType: docFileType,
      size: docSize,
      uploadedBy: req.user._id,
      status: req.user.role === "admin" ? "approved" : "pending",
    };

    // AI Analysis - Extract text and analyze
    let aiAnalysisResult = null;
    try {
      console.log(`Starting AI analysis for document: ${title}`);

      // Extract text from document
      const extractedText = await documentParserService.extractTextFromDocument(
        docFileUrl,
        docFileType,
      );

      // We use a lower threshold for AI analysis to handle small documents
      const MIN_TEXT_LENGTH = 10;
      let textToAnalyze = "";

      if (extractedText && extractedText.length >= MIN_TEXT_LENGTH) {
        console.log(`Using extracted text for AI analysis (${extractedText.length} chars)`);
        textToAnalyze = extractedText;
      } else if (description && description.length >= 5) {
        console.log(`Using description as fallback for AI analysis (${description.length} chars)`);
        textToAnalyze = description;
      }

      if (textToAnalyze) {
        const analysis = await aiService.analyzeDocument(textToAnalyze);

        if (analysis.success) {
          aiAnalysisResult = {
            aiSummary: analysis.data.aiSummary,
            topics: analysis.data.topics,
            policyViolation: analysis.data.policyViolation,
            isEducational: analysis.data.isEducational,
            recommendedCategory: analysis.data.recommendedCategory,
            analyzedAt: new Date(),
          };

          // Auto-update category if recommended
          if (analysis.data.recommendedCategory && !category) {
            docData.category = analysis.data.recommendedCategory;
          }

          // Auto-reject if policy violation detected
          if (analysis.data.policyViolation.hasViolation) {
            docData.status = "rejected";
            console.log(
              "Document rejected due to AI-detected policy violation:",
              analysis.data.policyViolation,
            );
          }
          
          console.log("AI analysis completed successfully.");
        } else {
          console.warn("AI analysis service returned success:false - skipping analysis.");
        }
      } else {
        console.warn("Skipping AI analysis: no meaningful text extracted and description is too short.");
      }
    } catch (aiError) {
      console.error("AI analysis error (non-blocking):", aiError.message);
      // Continue with document creation even if AI fails
    }

    // Add AI analysis to document data
    if (aiAnalysisResult) {
      docData.aiAnalysis = aiAnalysisResult;
    }


    const doc = await documentService.createDocument(docData);
    successResponse(res, 201, "Document created", doc);
  } catch (error) {
    errorResponse(res, 400, "Creation failed", error.message);
  }
};

const updateDocument = async (req, res) => {
  try {
    // Không cho phép update score qua API edit — phải dùng PUT /:id/score
    const { score, dynamicScore, scoreHistory, ...updateData } = req.body;
    const doc = await documentService.updateDocument(req.params.id, updateData);
    successResponse(res, 200, "Document updated", doc);
  } catch (error) {
    errorResponse(res, 400, "Update failed", error.message);
  }
};

const { cloudinary } = require("../configs/cloudinary"); // Import cloudinary

// ... other functions ...

const viewDocument = async (req, res) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id);
    if (!doc) {
      return errorResponse(res, 404, "Document not found");
    }

    // We use the direct fileUrl from DB.
    // If Cloudinary returns 401 for public access to PDFs, our backend (with server-side access)
    // can still fetch it or we can try to access it as a raw resource.
    const fileUrl = doc.fileUrl;

    try {
      const response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      const contentType = response.headers["content-type"];
      res.setHeader("Content-Type", contentType || "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      response.data.pipe(res);
    } catch (axiosError) {
      console.error("View Document Error Status:", axiosError.response?.status);

      // Fallback: If it's a PDF and direct access failed, try to serve it as an image transformation (page 1)
      // or check if account settings allow it.
      if (fileUrl.endsWith(".pdf") && axiosError.response?.status === 401) {
        return errorResponse(
          res,
          401,
          "Cloudinary PDF delivery is restricted. Please check account settings.",
        );
      }

      return errorResponse(res, 500, "Could not load document preview");
    }
  } catch (error) {
    console.error("View Document Error:", error.message);
    errorResponse(res, 500, "Could not load document", error.message);
  }
};

const searchDocuments = async (req, res) => {
  try {
    const { q, limit, page } = req.query;
    if (!q) {
      return successResponse(res, 200, "Search query is empty", {
        docs: [],
        total: 0,
        page: 1,
        pages: 0,
      });
    }
    const result = await documentService.searchDocuments(
      q,
      parseInt(limit) || 12,
      parseInt(page) || 1,
    );
    successResponse(res, 200, "Search results retrieved", result);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const addRecentlyViewed = async (req, res) => {
  try {
    const { id } = req.params;
    const recentlyViewed = await userService.addRecentlyViewed(
      req.user._id,
      id,
    );

    // Increment view count on the document
    const doc = await Document.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    );

    // Update dynamic score based on new view count
    if (doc) {
      try {
        await scoreService.updateScoreOnView(id);
      } catch (scoreErr) {
        console.error("Score update on view failed:", scoreErr.message);
      }
    }

    successResponse(res, 200, "Recently viewed added", recentlyViewed);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const getRecentlyViewed = async (req, res) => {
  try {
    const recentlyViewed = await userService.getRecentlyViewed(req.user._id);
    successResponse(res, 200, "Recently viewed retrieved", recentlyViewed);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const result = await recommendationService.getRecommendations(
      req.user._id,
      parseInt(limit) || 6,
      parseInt(page) || 1,
    );
    successResponse(res, 200, "Recommendations retrieved", result);
  } catch (error) {
    console.error("Recommendation Error:", error.message);
    errorResponse(res, 500, "Failed to get recommendations", error.message);
  }
};

// ===== SCORE MANAGEMENT =====

const setDocumentScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, reason } = req.body;

    if (score === undefined || score === null) {
      return errorResponse(res, 400, "Score is required");
    }

    const doc = await scoreService.setDocumentScore(
      id,
      Number(score),
      req.user._id,
      reason || "",
    );
    successResponse(res, 200, "Score updated", {
      score: doc.score,
      dynamicScore: doc.dynamicScore,
      scoreHistory: doc.scoreHistory,
    });
  } catch (error) {
    errorResponse(res, 500, "Failed to set score", error.message);
  }
};

const getScoreHistory = async (req, res) => {
  try {
    const doc = await scoreService.getScoreHistory(req.params.id);
    successResponse(res, 200, "Score history retrieved", doc);
  } catch (error) {
    errorResponse(res, 500, "Failed to get score history", error.message);
  }
};

const recalculateAllScores = async (req, res) => {
  try {
    const results = await scoreService.recalculateAllScores();
    successResponse(
      res,
      200,
      `Recalculated scores for ${results.length} documents`,
      results,
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to recalculate scores", error.message);
  }
};

const getTrendingDocuments = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const documents = await Document.find({ status: "approved" })
      .populate("uploadedBy", "fullName avatar")
      .populate("category", "name")
      .sort({ "dynamicScore.totalDynamicScore": -1 }) // Sắp xếp theo score cao nhất
      .limit(limit);

    successResponse(res, 200, "Trending documents retrieved", documents);
  } catch (error) {
    errorResponse(res, 500, "Failed to get trending documents", error.message);
  }
};

const getScoreAnalytics = async (req, res) => {
  try {
    const analytics = await scoreService.getScoreAnalytics();
    successResponse(res, 200, "Score analytics retrieved", analytics);
  } catch (error) {
    errorResponse(res, 500, "Failed to get analytics", error.message);
  }
};

module.exports = {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  approveDocument,
  rejectDocument,
  deleteDocument,
  viewDocument,
  getMyDocuments,
  toggleFavorite,
  getFavorites,
  searchDocuments,
  addRecentlyViewed,
  getRecentlyViewed,
  getRecommendations,
  getTrendingDocuments,
  setDocumentScore,
  getScoreHistory,
  recalculateAllScores,
  getScoreAnalytics,
};
