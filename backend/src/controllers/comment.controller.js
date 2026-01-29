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

const deleteComment = async (req, res) => {
  try {
    await commentService.deleteComment(req.params.id);
    successResponse(res, 200, "Comment deleted");
  } catch (error) {
    errorResponse(res, 400, "Delete failed", error.message);
  }
};

module.exports = {
  getComments,
  deleteComment,
};
