import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getDocumentByIdApi,
  toggleFavoriteApi,
  getDocumentCommentsApi,
  createCommentApi,
  deleteCommentApi,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Spin, Empty, message, Tag, Avatar, Popconfirm } from "antd";
import { formatDateVN } from "../../utils/dateUtils";

const ExploreDocsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser, isAuthenticated } = useAuth();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // { id, fullName }
  const [expandedComments, setExpandedComments] = useState({}); // { commentId: boolean }

  const fetchComments = async () => {
    try {
      const res = await getDocumentCommentsApi(id);
      if (res && res.statusCode === 200) {
        setComments(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleCommentSubmit = async (e, content, parentId = null) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      message.warning("Please login to comment");
      return;
    }
    const finalContent = content || newComment;
    if (!finalContent.trim()) return;

    setCommentLoading(true);
    try {
      const res = await createCommentApi(id, finalContent, parentId);
      if (res && res.statusCode === 201) {
        if (!parentId) setNewComment("");
        setReplyingTo(null);
        fetchComments();
        message.success(parentId ? "Reply posted" : "Comment posted");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      message.error("Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteCommentApi(commentId);
      if (res && res.statusCode === 200) {
        message.success("Comment deleted");
        fetchComments();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      message.error("Failed to delete comment");
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      message.warning("Please login to favorite documents");
      return;
    }
    try {
      const res = await toggleFavoriteApi(id);
      if (res && res.statusCode === 200) {
        refreshUser(true);
        const isFavorited = user?.favorites?.includes(id);
        message.success(
          isFavorited ? "Removed from favorites" : "Added to favorites",
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      message.error("Failed to update favorite");
    }
  };
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        const res = await getDocumentByIdApi(id);
        if (res && res.statusCode === 200) {
          setDocument(res.data);
        } else {
          message.error("Document not found");
        }
      } catch (error) {
        console.error("Failed to fetch document:", error);
        message.error("Failed to load document details");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
    fetchComments();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark min-h-screen">
        <Empty description="Document not found" />
      </div>
    );
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/40 min-h-full">
      {/* Premium Header */}
      <header className="bg-white dark:bg-[#1a202c] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Go back"
              >
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                  arrow_back
                </span>
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {document.status === "approved" && (
                    <Tag
                      color="success"
                      icon={
                        <span className="material-symbols-outlined text-[14px]">
                          verified
                        </span>
                      }
                    >
                      Approved
                    </Tag>
                  )}
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">
                    {typeof document.category === "object"
                      ? document.category?.name
                      : "General"}
                  </span>
                </div>
                <h1 className="text-xl font-extrabold text-[#111318] dark:text-white line-clamp-1">
                  {document.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open(document.fileUrl, "_blank")}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white hover:bg-blue-600 font-bold transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">download</span>
                Download
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-2.5 rounded-xl border transition-all ${
                  user?.favorites?.includes(id)
                    ? "border-red-200 bg-red-50 text-red-500 shadow-sm shadow-red-500/10"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                title={
                  user?.favorites?.includes(id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: `'FILL' ${user?.favorites?.includes(id) ? 1 : 0}`,
                  }}
                >
                  favorite
                </span>
              </button>
              <button className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Visualizer Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-[#1a202c] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col min-h-[800px]">
                {/* Toolbar */}
                <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleZoomOut}
                      className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                      <span className="material-symbols-outlined">
                        remove_circle_outline
                      </span>
                    </button>
                    <span className="text-sm font-bold w-12 text-center">
                      {zoom}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                      <span className="material-symbols-outlined">
                        add_circle_outline
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        visibility
                      </span>
                      {document.views || 0} views
                    </span>
                  </div>
                </div>

                {/* Viewport */}
                <div className="flex-1 p-4 bg-gray-100/50 dark:bg-[#0d121c] overflow-auto flex justify-center no-scrollbar relative">
                  <div
                    className="w-full origin-top transition-transform duration-300 shadow-2xl rounded-lg overflow-hidden bg-white dark:bg-[#1e1e1e]"
                    style={{
                      transform: `scale(${zoom / 100})`,
                      maxWidth: "1000px",
                    }}
                  >
                    {(() => {
                      const type = document.fileType?.toLowerCase() || "";
                      if (type.includes("pdf")) {
                        return (
                          <iframe
                            src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/documents/view/${document._id}?token=${localStorage.getItem("accessToken")}#toolbar=0`}
                            className="w-full h-[1100px] border-none"
                            title={document.title}
                          />
                        );
                      }
                      if (
                        type.includes("image") ||
                        ["jpg", "jpeg", "png", "webp", "gif"].some((ext) =>
                          type.includes(ext),
                        )
                      ) {
                        return (
                          <img
                            src={document.fileUrl}
                            className="w-full h-auto"
                            alt={document.title}
                          />
                        );
                      }
                      if (
                        type.includes("word") ||
                        type.includes("presentation") ||
                        type.includes("spreadsheet") ||
                        type.includes("docx") ||
                        type.includes("pptx") ||
                        type.includes("xlsx") ||
                        type.includes("officedocument") ||
                        type.includes("msword")
                      ) {
                        return (
                          <iframe
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.fileUrl)}&embedded=true`}
                            className="w-full h-[1100px] border-none"
                            title={document.title}
                          />
                        );
                      }
                      return (
                        <div className="p-20 flex flex-col items-center justify-center text-center gap-6">
                          <span className="material-symbols-outlined text-8xl text-primary/20">
                            description
                          </span>
                          <h2 className="text-2xl font-bold">
                            Preview not available
                          </h2>
                          <p className="text-gray-500 max-w-md">
                            This file type ({document.fileType}) cannot be
                            rendered directly in the browser. Please download it
                            to view the full content.
                          </p>
                          <button
                            onClick={() =>
                              window.open(document.fileUrl, "_blank")
                            }
                            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all"
                          >
                            Download Now
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Description & Metadata Card */}
              <div className="bg-white dark:bg-[#1a202c] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                  About this Document
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-8 whitespace-pre-wrap">
                  {document.description}
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Uploaded By
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        src={
                          document.uploadedBy?.avatar ||
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuAyywXwl8gB4T9Bg9qX9-leZ11D89IRurmjopEmaVLe8fb1_-XmfW1qUAPN3KTlfYeZLGrh9uOinAWO3tx9Cng6KTAzRaGPZO6ssq3XLlkWshY4TdFL5sT7304FdXjnyxvK-TQaIRgl4mIXVSqVdP7URgiFAnEZwYQsjE2ChCLfk5RkWy9766mMFa_vVjnxX4UQP02KzTlFdpcxCUh_GQw3qsS1e_soqV_xAd8Us7trwMTUApJxzEI99yqJ4z0-NIcLKFutPvmtQkg"
                        }
                        className="bg-primary/10 text-primary font-bold"
                      >
                        {document.uploadedBy?.fullName?.charAt(0)}
                      </Avatar>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {document.uploadedBy?.fullName || "Anonymous"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Category
                    </span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {typeof document.category === "object"
                        ? document.category?.name
                        : "General"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      File Size
                    </span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {(document.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Last Modified
                    </span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {formatDateVN(document.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Comment Section */}
              <div className="bg-white dark:bg-[#1a202c] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-primary">
                    <span className="material-symbols-outlined">forum</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      Discussion
                    </h2>
                    <p className="text-sm text-gray-500">
                      {comments.length} thoughts shared by the community
                    </p>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="flex gap-4 mb-10">
                  <Avatar
                    size="large"
                    src={
                      user?.avatar ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuAyywXwl8gB4T9Bg9qX9-leZ11D89IRurmjopEmaVLe8fb1_-XmfW1qUAPN3KTlfYeZLGrh9uOinAWO3tx9Cng6KTAzRaGPZO6ssq3XLlkWshY4TdFL5sT7304FdXjnyxvK-TQaIRgl4mIXVSqVdP7URgiFAnEZwYQsjE2ChCLfk5RkWy9766mMFa_vVjnxX4UQP02KzTlFdpcxCUh_GQw3qsS1e_soqV_xAd8Us7trwMTUApJxzEI99yqJ4z0-NIcLKFutPvmtQkg"
                    }
                    className="bg-primary/10 text-primary font-bold shrink-0 shadow-sm"
                  >
                    {user?.fullName?.charAt(0) || "?"}
                  </Avatar>
                  <div className="flex-1">
                    <form
                      onSubmit={(e) => handleCommentSubmit(e)}
                      className="relative group"
                    >
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleCommentSubmit();
                          }
                        }}
                        placeholder={
                          isAuthenticated
                            ? "Share your thoughts or ask a question..."
                            : "Please login to join the discussion"
                        }
                        disabled={!isAuthenticated || commentLoading}
                        rows="3"
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none disabled:opacity-50"
                      ></textarea>
                      <button
                        type="submit"
                        disabled={
                          !isAuthenticated ||
                          !newComment.trim() ||
                          commentLoading
                        }
                        className="absolute right-3 bottom-3 p-3 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-200 disabled:dark:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center justify-center group/btn"
                        title="Post Comment"
                      >
                        {commentLoading ? (
                          <Spin size="small" />
                        ) : (
                          <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-0.5 transition-transform">
                            send
                          </span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-8">
                  {comments.length > 0 ? (
                    (() => {
                      const topLevelComments = comments.filter(
                        (c) => !c.parentComment,
                      );

                      const renderComment = (comment, level = 0) => {
                        const directReplies = comments
                          .filter((c) => c.parentComment === comment._id)
                          .reverse();
                        const isExpanded = expandedComments[comment._id];
                        const visibleReplies = isExpanded
                          ? directReplies
                          : directReplies.slice(0, 3);

                        return (
                          <div key={comment._id} className="group">
                            <div className="flex gap-4">
                              <Avatar
                                size={level === 0 ? "default" : "small"}
                                src={
                                  comment.user?.avatar ||
                                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAyywXwl8gB4T9Bg9qX9-leZ11D89IRurmjopEmaVLe8fb1_-XmfW1qUAPN3KTlfYeZLGrh9uOinAWO3tx9Cng6KTAzRaGPZO6ssq3XLlkWshY4TdFL5sT7304FdXjnyxvK-TQaIRgl4mIXVSqVdP7URgiFAnEZwYQsjE2ChCLfk5RkWy9766mMFa_vVjnxX4UQP02KzTlFdpcxCUh_GQw3qsS1e_soqV_xAd8Us7trwMTUApJxzEI99yqJ4z0-NIcLKFutPvmtQkg"
                                }
                                className={`bg-primary/10 text-primary font-bold shrink-0 ${level > 0 ? "size-8" : ""}`}
                              >
                                {comment.user?.fullName?.charAt(0)}
                              </Avatar>
                              <div className="flex-1">
                                <div
                                  className={`${level === 0 ? "bg-slate-50 dark:bg-slate-900/40" : "bg-slate-100/50 dark:bg-slate-900/20"} rounded-2xl p-5 border border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-800 transition-all`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                                      {comment.user?.fullName}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                      {formatDateVN(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {comment.content}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 px-2">
                                  <button
                                    onClick={() =>
                                      setReplyingTo({
                                        id: comment._id,
                                        fullName: comment.user?.fullName,
                                      })
                                    }
                                    className="text-[11px] font-bold text-gray-400 hover:text-primary uppercase tracking-widest transition-colors"
                                  >
                                    Reply
                                  </button>
                                  {(user?.role === "admin" ||
                                    user?._id === comment.user?._id) && (
                                    <Popconfirm
                                      title="Delete"
                                      description="Remove this comment?"
                                      onConfirm={() =>
                                        handleDeleteComment(comment._id)
                                      }
                                      okText="Delete"
                                      cancelText="Cancel"
                                      okButtonProps={{ danger: true }}
                                    >
                                      <button className="text-[11px] font-bold text-red-400/60 hover:text-red-500 uppercase tracking-widest transition-colors ml-auto">
                                        Delete
                                      </button>
                                    </Popconfirm>
                                  )}
                                </div>

                                <div className="mt-4 ml-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-4">
                                  {visibleReplies.map((reply) =>
                                    renderComment(reply, level + 1),
                                  )}

                                  {!isExpanded && directReplies.length > 3 && (
                                    <button
                                      onClick={() =>
                                        setExpandedComments((prev) => ({
                                          ...prev,
                                          [comment._id]: true,
                                        }))
                                      }
                                      className="text-[11px] font-extrabold text-primary hover:underline flex items-center gap-2 mt-2"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">
                                        subdirectory_arrow_right
                                      </span>
                                      View {directReplies.length - 3} more
                                      replies
                                    </button>
                                  )}

                                  {replyingTo?.id === comment._id && (
                                    <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                      <Avatar
                                        size="small"
                                        src={
                                          user?.avatar ||
                                          "https://lh3.googleusercontent.com/aida-public/AB6AXuAyywXwl8gB4T9Bg9qX9-leZ11D89IRurmjopEmaVLe8fb1_-XmfW1qUAPN3KTlfYeZLGrh9uOinAWO3tx9Cng6KTAzRaGPZO6ssq3XLlkWshY4TdFL5sT7304FdXjnyxvK-TQaIRgl4mIXVSqVdP7URgiFAnEZwYQsjE2ChCLfk5RkWy9766mMFa_vVjnxX4UQP02KzTlFdpcxCUh_GQw3qsS1e_soqV_xAd8Us7trwMTUApJxzEI99yqJ4z0-NIcLKFutPvmtQkg"
                                        }
                                        className="bg-primary/10 text-primary font-bold shrink-0"
                                      />
                                      <div className="flex-1">
                                        <div className="relative">
                                          <textarea
                                            autoFocus
                                            placeholder={`Reply to ${replyingTo.fullName}...`}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none pr-12"
                                            onKeyDown={(e) => {
                                              if (
                                                e.key === "Enter" &&
                                                !e.shiftKey
                                              ) {
                                                e.preventDefault();
                                                handleCommentSubmit(
                                                  null,
                                                  e.target.value,
                                                  comment._id,
                                                );
                                              }
                                            }}
                                          />
                                          <div className="absolute right-2 bottom-2 flex flex-col gap-1">
                                            <button
                                              onClick={() =>
                                                setReplyingTo(null)
                                              }
                                              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                            >
                                              <span className="material-symbols-outlined text-sm">
                                                close
                                              </span>
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                const content =
                                                  e.currentTarget.parentElement
                                                    .previousElementSibling
                                                    .value;
                                                handleCommentSubmit(
                                                  null,
                                                  content,
                                                  comment._id,
                                                );
                                              }}
                                              className="p-1.5 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                                            >
                                              <span className="material-symbols-outlined text-sm">
                                                send
                                              </span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      };

                      return topLevelComments.map((comment) =>
                        renderComment(comment, 0),
                      );
                    })()
                  ) : (
                    <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                      <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">
                        chat_bubble_outline
                      </span>
                      <p className="text-gray-400 text-sm">
                        No comments yet. Be the first to start the conversation!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Area: AI Analysis & Community */}
            <div className="lg:col-span-4 space-y-6">
              {/* AI Magic Box */}
              <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 rounded-3xl border border-primary/10 dark:border-primary/20 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-[20px]">
                      auto_awesome
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                    AI Insights
                  </h2>
                </div>

                {document.aiAnalysis?.aiSummary ? (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-white dark:border-slate-800 shadow-sm italic text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      "{document.aiAnalysis.aiSummary}"
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Main Topics
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {document.aiAnalysis.topics?.map((topic, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm capitalize"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-500 uppercase tracking-widest">
                          Educational Score
                        </span>
                        <span className="text-green-500">High Quality</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-3 overflow-hidden">
                        <div className="w-[92%] h-full bg-gradient-to-r from-primary to-purple-500"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">
                      AI Analysis is not available for this file.
                    </p>
                  </div>
                )}
              </div>

              {/* Support / Quick Tools */}
              <div className="bg-white dark:bg-[#1a202c] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6">
                  Need Help?
                </h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        report
                      </span>
                      <span className="text-sm font-bold">Report Content</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">
                        help_outline
                      </span>
                      <span className="text-sm font-bold">Community Q&A</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreDocsDetail;
