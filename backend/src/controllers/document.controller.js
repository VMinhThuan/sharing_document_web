const documentService = require("../services/document.service");
const { successResponse, errorResponse } = require("../utils/response");

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

module.exports = {
  getDocuments,
  createDocument,
  updateDocument,
  approveDocument,
  rejectDocument,
  deleteDocument,
};
