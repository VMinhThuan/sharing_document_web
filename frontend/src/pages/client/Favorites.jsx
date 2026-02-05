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
  const { user, refreshUser } = useAuth();
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
    <main className="min-h-full flex flex-col bg-gray-50 dark:bg-background-dark relative">
      <header className="sticky top-0 z-30 px-8 py-5 bg-gray-50/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <button className="md:hidden p-2 text-gray-500 dark:text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
                search
              </span>
            </span>
            <input
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              placeholder="Search your favorites..."
              type="text"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <button className="p-2.5 rounded-xl bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors relative shadow-sm">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1e293b]"></span>
          </button>
        </div>
      </header>

      <div className="px-8 pb-10 max-w-7xl mx-auto w-full flex-1">
        <div className="pt-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Favorites
            </h2>
            <p className="text-gray-500 dark:text-[#94a3b8]">
              Manage and organize your saved learning materials.
            </p>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setActiveTab("documents");
                setCurrentPage(1);
              }}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === "documents"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => {
                setActiveTab("comments");
                setCurrentPage(1);
              }}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === "comments"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              Comments
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : displayData.length > 0 ? (
            <>
              <div
                className={
                  activeTab === "documents"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    : "space-y-4 mb-8"
                }
              >
                {displayData
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((item) => {
                    if (activeTab === "documents") {
                      return (
                        <Link
                          key={item._id}
                          to={`/documents/${item._id}`}
                          className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-500/30 transition-all group p-5 flex flex-col"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400">
                              <span className="material-symbols-outlined text-2xl">
                                {item.fileType?.includes("pdf")
                                  ? "picture_as_pdf"
                                  : "description"}
                              </span>
                            </div>
                            <button
                              onClick={(e) => handleToggleFavorite(e, item._id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                            >
                              <span
                                className="material-symbols-outlined text-xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                favorite
                              </span>
                            </button>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                            {item.description || "No description provided."}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                              {formatFileType(item.fileType)}
                            </span>
                            {item.category?.name && (
                              <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                                {item.category.name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-[#334155] mt-auto">
                            <span>Added {formatDateVN(item.createdAt)}</span>
                            <span>
                              {(item.size / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          </div>
                        </Link>
                      );
                    } else {
                      // Comments tab
                      return (
                        <div
                          key={item._id}
                          className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-[#334155] p-5 shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                {item.user?.avatar ? (
                                  <img
                                    src={item.user.avatar}
                                    alt={item.user.fullName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-sm font-bold">
                                    {item.user?.fullName?.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                  {item.user?.fullName}
                                </h4>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  Liked {formatDateVN(item.createdAt)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleUnlikeComment(item._id)}
                              className="text-primary hover:text-blue-600 transition-colors"
                              title="Unlike"
                            >
                              <span
                                className="material-symbols-outlined text-xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                thumb_up
                              </span>
                            </button>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                            {item.content}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#334155]">
                            <Link
                              to={`/documents/${item.document?._id}`}
                              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">
                                article
                              </span>
                              In: {item.document?.title}
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
              <div className="flex justify-center mt-10">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={displayData.length}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={["6", "9", "12", "18"]}
                  className="custom-pagination"
                />
              </div>
            </>
          ) : (
            <div className="py-20">
              <Empty
                description={
                  activeTab === "documents"
                    ? "You haven't added any documents to your favorites yet."
                    : "You haven't liked any comments yet."
                }
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Favorites;
