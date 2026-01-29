const Comment = require("../models/comment.model");

const getAllComments = async () => {
  return await Comment.find()
    .populate("user", "fullName email avatar")
    .populate("document", "title")
    .sort({ createdAt: -1 });
};

const deleteComment = async (id) => {
  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) throw new Error("Comment not found");
  return comment;
};

module.exports = {
  getAllComments,
  deleteComment,
};
