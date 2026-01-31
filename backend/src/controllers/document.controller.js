const documentService = require("../services/document.service");
const aiService = require("../services/ai.service");
const documentParserService = require("../services/documentParser.service");
const { successResponse, errorResponse } = require("../utils/response");
const axios = require("axios");

const getDocuments = async (req, res) => {
  try {
    const { status } = req.query;
    const docs = await documentService.getDocuments(status);
    successResponse(res, 200, "Documents retrieved", docs);
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
    const { title, description, category, score, fileUrl, type, size } =
      req.body;

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

    // Construct document data
    const docData = {
      title,
      description,
      category: category || "Other",
      score: score || 0,
      fileUrl: docFileUrl,
      fileType: docFileType,
      size: docSize,
      uploadedBy: req.user._id,
      status: "approved", // Admin created docs are auto-approved
    };

    // AI Analysis - Extract text and analyze
    let aiAnalysisResult = null;
    try {
      console.log("Starting AI analysis for document...");

      // Extract text from document
      const extractedText = await documentParserService.extractTextFromDocument(
        docFileUrl,
        docFileType,
      );

      // If we have meaningful text, analyze it with AI
      if (extractedText && extractedText.length > 50) {
        console.log("Extracted text length:", extractedText.length);
        const analysis = await aiService.analyzeDocument(extractedText);

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
              "Document rejected due to policy violation:",
              analysis.data.policyViolation,
            );
          }
        } else {
          console.error("AI analysis failed:", analysis.error);
        }
      } else {
        // Use description as fallback for AI analysis
        if (description && description.length > 50) {
          const analysis = await aiService.analyzeDocument(description);
          if (analysis.success) {
            aiAnalysisResult = {
              aiSummary: analysis.data.aiSummary,
              topics: analysis.data.topics,
              policyViolation: analysis.data.policyViolation,
              isEducational: analysis.data.isEducational,
              recommendedCategory: analysis.data.recommendedCategory,
              analyzedAt: new Date(),
            };
          }
        }
      }
    } catch (aiError) {
      console.error("AI analysis error (non-blocking):", aiError);
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
    const doc = await documentService.updateDocument(req.params.id, req.body);
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

    // SIMPLIFIED LOGIC:
    // Since we now upload files with type="authenticated", Cloudinary returns a fully signed, securely accessible URL
    // as the 'path' property during upload. We saved this to the DB.
    // So `doc.fileUrl` is ALREADY a valid, signed, authenticated URL.

    // We just need to fetch it directly.
    // SIMPLIFIED PROXY LOGIC:
    // We upload files as 'image'/'auto' (public), so the URL should be accessible directly.
    // We proxy it to avoid CORS issues and handle Content-Disposition correctly.

    // We use the fileUrl directly from the DB.
    // IMAGE PREVIEW STRATEGY:
    // We fetch the PDF as a JPG thumbnail (page 1) to bypass potential PDF blocking/download behavior.

    let previewUrl = doc.fileUrl;
    if (previewUrl.endsWith(".pdf")) {
      previewUrl = previewUrl.replace(".pdf", ".jpg");
    }

    try {
      const response = await axios({
        url: previewUrl,
        method: "GET",
        responseType: "stream",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.0.0 Safari/537.36",
        },
      });

      // It will be image/jpeg
      const contentType = response.headers["content-type"];
      res.setHeader("Content-Type", contentType || "image/jpeg");
      res.setHeader("Content-Disposition", "inline");
      response.data.pipe(res);
    } catch (axiosError) {
      console.error("View Document Error Status:", axiosError.response?.status);
      return errorResponse(res, 500, "Could not load document preview");
    }
  } catch (error) {
    console.error(
      "View Document Error:",
      error.response?.status,
      error.message,
    );
    errorResponse(res, 500, "Could not load document", error.message);
  }
};

module.exports = {
  getDocuments,
  createDocument,
  updateDocument,
  approveDocument,
  rejectDocument,
  deleteDocument,
  viewDocument,
};
