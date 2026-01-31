const commentService = require("../services/comment.service");
const { successResponse, errorResponse } = require("../utils/response");

const getComments = async (req, res) => {
  try {
    const comments = await commentService.getAllComments();
    successResponse(res, 200, "Comments retrieved", comments);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const getDocumentComments = async (req, res) => {
  try {
    const { documentId } = req.params;
    const comments = await commentService.getCommentsByDocument(documentId);
    successResponse(res, 200, "Comments retrieved", comments);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const createComment = async (req, res) => {
  try {
    const { documentId, content } = req.body;
    const comment = await commentService.createComment(
      req.user._id,
      documentId,
      content,
    );
    successResponse(res, 201, "Comment created", comment);
  } catch (error) {
    errorResponse(res, 400, "Create failed", error.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    // Pass user info for authorization check
    await commentService.deleteComment(
      req.params.id,
      req.user._id,
      req.user.role,
    );
    successResponse(res, 200, "Comment deleted");
  } catch (error) {
    errorResponse(res, 400, "Delete failed", error.message);
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await commentService.updateComment(
      req.params.id,
      req.user._id,
      req.body.content,
      req.user.role,
    );
    successResponse(res, 200, "Comment updated", comment);
  } catch (error) {
    errorResponse(res, 400, "Update failed", error.message);
  }
};

module.exports = {
  getComments,
  getDocumentComments,
  createComment,
  deleteComment,
  updateComment,
};
