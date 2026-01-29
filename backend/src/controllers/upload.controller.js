const uploadService = require("../services/upload.service");
const { successResponse, errorResponse } = require("../utils/response");

const uploadFile = async (req, res) => {
  try {
    const fileData = await uploadService.processUploadedFile(req.file);
    successResponse(res, 200, "File uploaded successfully", fileData);
  } catch (error) {
    errorResponse(res, 400, "Upload failed", error.message);
  }
};

module.exports = {
  uploadFile,
};
