const Comment = require("../models/comment.model");
const Document = require("../models/document.model");

const getAllComments = async () => {
  return await Comment.find()
    .populate("user", "fullName email avatar")
    .populate("document", "title")
    .sort({ createdAt: -1 });
};

const getCommentsByDocument = async (documentId) => {
  return await Comment.find({ document: documentId })
    .populate("user", "fullName email avatar")
    .sort({ createdAt: -1 });
};

const createComment = async (
  userId,
  documentId,
  content,
  parentCommentId = null,
) => {
  const document = await Document.findById(documentId);
  if (!document) {
    throw new Error("Document not found");
  }

  const commentData = {
    content,
    user: userId,
    document: documentId,
  };

  if (parentCommentId) {
    commentData.parentComment = parentCommentId;
  }

  const comment = await Comment.create(commentData);

  return await comment.populate("user", "fullName email avatar");
};

const deleteComment = async (id, userId = null, role = null) => {
  const comment = await Comment.findById(id);
  if (!comment) throw new Error("Comment not found");

  // If userId and role provides, check authorization
  // Admin can delete any. User can only delete their own.
  if (userId && role !== "admin") {
    if (comment.user.toString() !== userId.toString()) {
      throw new Error("Not authorized to delete this comment");
    }
  }

  await comment.deleteOne();
  return comment;
};

const updateComment = async (id, userId, content, role) => {
  const comment = await Comment.findById(id);
  if (!comment) throw new Error("Comment not found");

  if (role !== "admin" && comment.user.toString() !== userId.toString()) {
    throw new Error("Not authorized to update this comment");
  }

  comment.content = content;
  await comment.save();
  return comment;
};

const toggleLike = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");

  const isLiked = comment.likes.includes(userId);

  if (isLiked) {
    // Unlike
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId.toString(),
    );
  } else {
    // Like
    comment.likes.push(userId);
  }

  await comment.save();
  return comment;
};

const getLikedComments = async (userId) => {
  return await Comment.find({ likes: userId })
    .populate("user", "fullName avatar")
    .populate("document", "title")
    .sort({ createdAt: -1 });
};

module.exports = {
  getAllComments,
  getCommentsByDocument,
  createComment,
  deleteComment,
  updateComment,
  toggleLike,
  getLikedComments,
};
