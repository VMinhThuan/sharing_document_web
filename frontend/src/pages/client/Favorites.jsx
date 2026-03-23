import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getFavoritesApi,
  toggleFavoriteApi,
  getFavoriteCommentsApi,
  toggleCommentLikeApi,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Spin, message, Empty, Pagination } from "antd";
import { formatDateVN } from "../../utils/dateUtils";
import TopHeader from "../../components/TopHeader/TopHeader";

const formatFileType = (type) => {
  if (!type) return "FILE";
  const t = type.toLowerCase();
  if (t.includes("pdf")) return "PDF";
  if (t.includes("wordprocessingml") || t.includes("msword")) return "DOCX";
  if (t.includes("presentationml") || t.includes("powerpoint")) return "PPTX";
  if (t.includes("spreadsheetml") || t.includes("excel")) return "XLSX";
  if (t.includes("image")) return "IMG";
  return t.split("/").pop().toUpperCase().substring(0, 5);
};

const Favorites = () => {
  const { refreshUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteComments, setFavoriteComments] = useState([]);
  const [activeTab, setActiveTab] = useState("documents"); // 'documents' or 'comments'
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page, pSize) => {
    setCurrentPage(page);
    setPageSize(pSize);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [favDocsRes, favCommentsRes] = await Promise.all([
        getFavoritesApi(),
        getFavoriteCommentsApi(),
      ]);

      if (favDocsRes && favDocsRes.statusCode === 200) {
        setFavorites(favDocsRes.data);
      }
      if (favCommentsRes && favCommentsRes.statusCode === 200) {
        setFavoriteComments(favCommentsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      message.error("Failed to load your favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleFavorite = async (e, docId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await toggleFavoriteApi(docId);
      if (res && res.statusCode === 200) {
        refreshUser(true);
        // Update local state by removing favorited item
        setFavorites((prev) => prev.filter((doc) => doc._id !== docId));
        message.success("Removed from favorites");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      message.error("Failed to update favorite");
    }
  };

  const handleUnlikeComment = async (commentId) => {
    try {
      const res = await toggleCommentLikeApi(commentId);
      if (res && res.statusCode === 200) {
        setFavoriteComments((prev) => prev.filter((c) => c._id !== commentId));
        message.success("Removed from liked comments");
      }
    } catch (error) {
      console.error("Failed to unlike comment:", error);
    }
  };

  const filteredFavorites = favorites.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const filteredComments = favoriteComments.filter((comment) =>
    comment.content.toLowerCase().includes(searchText.toLowerCase()),
  );

  const displayData =
    activeTab === "documents" ? filteredFavorites : filteredComments;

  return (
    <main className="min-h-full flex flex-col bg-[#f9fafb] dark:bg-background-dark relative">
      <TopHeader title="Your Favorites" />
      <div className="px-8 pb-10 max-w-7xl mx-auto w-full flex-1">
        <div className="pt-8 mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            Your Favorites
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            All your saved documents and liked comments in one place.
          </p>
        </div>
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "documents" ? "bg-white dark:bg-[#1e293b] text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Documents ({favorites.length})
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "comments" ? "bg-white dark:bg-[#1e293b] text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Comments ({favoriteComments.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spin size="large" />
            <p className="mt-4 text-gray-400">Loading your favorites...</p>
          </div>
        ) : displayData.length === 0 ? (
          <div className="py-20 bg-white dark:bg-[#1e293b] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
            <Empty
              description={
                <span className="text-gray-400 dark:text-gray-500">
                  {searchText
                    ? "No matches found for your search"
                    : activeTab === "documents"
                      ? "You haven't saved any documents yet"
                      : "You haven't liked any comments yet"}
                </span>
              }
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === "documents"
                ? displayData
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((doc) => (
                      <Link
                        key={doc._id}
                        to={`/documents/${doc._id}`}
                        className="group bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary dark:hover:border-primary transition-all shadow-sm hover:shadow-md block relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold tracking-wider">
                              {formatFileType(doc.fileType)}
                            </span>
                            <button
                              onClick={(e) => handleToggleFavorite(e, doc._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-400/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                              title="Remove from favorites"
                            >
                              <span className="material-symbols-outlined text-[18px] font-variation-fill">
                                favorite
                              </span>
                            </button>
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors text-[15px] mb-2 line-clamp-2">
                            {doc.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                            {doc.description || "No description available"}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/50">
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px]">
                                visibility
                              </span>{" "}
                              {doc.views || 0}
                            </span>
                            <span>{formatDateVN(doc.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                : displayData
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  comment.user?.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.fullName || comment.user?.username || "User")}&background=3b82f6&color=fff`
                                }
                                alt="Commenter"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                {comment.user?.fullName || comment.user?.username}
                              </h4>
                              <p className="text-[11px] text-gray-400">
                                {formatDateVN(comment.createdAt)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnlikeComment(comment._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-400/10 text-red-500"
                          >
                            <span className="material-symbols-outlined text-[18px] font-variation-fill">
                              favorite
                            </span>
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4">
                          "{comment.content}"
                        </p>
                        <div className="pt-3 border-t border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
                          <span className="text-[11px] text-gray-400">
                            on: {comment.document?.title || "Unknown Document"}
                          </span>
                          <Link
                            to={`/documents/${comment.document?._id}`}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            View Document
                          </Link>
                        </div>
                      </div>
                    ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={displayData.length}
                onChange={handlePageChange}
                showSizeChanger
                onShowSizeChange={handlePageChange}
                pageSizeOptions={["6", "12", "24"]}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Favorites;
