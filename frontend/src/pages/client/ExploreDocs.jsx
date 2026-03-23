import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getDocumentsApi, toggleFavoriteApi } from "../../services/api";
import { Spin, Empty, message, Pagination } from "antd";
import { formatDateVN } from "../../utils/dateUtils";
import { formatFileType } from "../../utils/fileUtils";
import TopHeader from "../../components/TopHeader/TopHeader";

const ExploreDocs = () => {
  const { user, refreshUser, isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const pageSize = 12;

  const handleToggleFavorite = async (e, docId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      message.warning("Please login to favorite documents");
      return;
    }
    try {
      const res = await toggleFavoriteApi(docId);
      if (res && res.statusCode === 200) {
        refreshUser(true);
        const isFavorited = user?.favorites?.includes(docId);
        message.success(
          isFavorited ? "Removed from favorites" : "Added to favorites",
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      message.error("Failed to update favorite");
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await getDocumentsApi("approved", pageSize, currentPage);
        if (res && res.statusCode === 200) {
          setDocuments(res.data.docs || []);
          setTotalDocs(res.data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        message.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [currentPage]);

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="flex-1 flex flex-col min-h-full bg-[#f9fafb] dark:bg-background-dark relative">
      <TopHeader title="Explore Documents" />

      {/* Hero Section */}
      <div className="bg-white dark:bg-[#1a202c] border-b border-gray-100 dark:border-gray-800 pt-20 pb-10 px-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Explore Knowledge
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl font-medium">
                Discover, learn, and grow with thousands of high-quality
                documents shared by the community.
              </p>
            </div>
            <div className="w-full md:w-96">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Filter documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-[#1f2937] rounded-2xl outline-none transition-all dark:text-white text-sm font-bold shadow-sm"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  filter_list
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spin size="large" />
              <p className="mt-4 text-gray-500 font-medium italic">
                Crying knowledge roots...
              </p>
            </div>
          ) : filteredDocs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredDocs.map((doc) => (
                  <Link
                    key={doc._id}
                    to={`/documents/${doc._id}`}
                    className="group bg-white dark:bg-[#1a202c] rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col gap-5 overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-gray-50 dark:border-gray-700">
                      {doc.fileType?.toLowerCase().includes("pdf") ? (
                        <span className="material-symbols-outlined text-6xl text-red-500/40 group-hover:scale-125 transition-transform duration-700">
                          picture_as_pdf
                        </span>
                      ) : doc.fileType?.toLowerCase().includes("image") ? (
                        <img
                          src={doc.fileUrl}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-6xl text-blue-500/40 group-hover:scale-125 transition-transform duration-700">
                          article
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>

                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 rounded-lg bg-white/95 dark:bg-black/60 backdrop-blur-md text-[10px] font-black text-gray-700 dark:text-gray-200 shadow-sm uppercase tracking-widest border border-white/20">
                          {formatFileType(doc.fileType)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleToggleFavorite(e, doc._id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/95 dark:bg-black/60 backdrop-blur-md flex items-center justify-center shadow-lg z-10 transition-all hover:scale-110 active:scale-95 border border-white/20"
                      >
                        <span
                          className={`material-symbols-outlined text-[20px] ${user?.favorites?.includes(doc._id) ? "text-red-500" : "text-gray-400 group-hover:text-red-500"}`}
                          style={{
                            fontVariationSettings: `'FILL' ${user?.favorites?.includes(doc._id) ? 1 : 0}`,
                          }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-extrabold text-[#1a202c] dark:text-white line-clamp-1 group-hover:text-primary transition-colors text-lg">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[40px] leading-relaxed">
                        {doc.description ||
                          "Unlock the potential of this document with a single click."}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {doc.uploadedBy?.avatar ? (
                          <img
                            src={doc.uploadedBy.avatar}
                            alt={doc.uploadedBy.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-gray-100 dark:border-gray-700 shadow-sm"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105">
                            <span className="text-[11px] font-black">
                              {doc.uploadedBy?.fullName?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] font-black text-gray-900 dark:text-gray-200 truncate group-hover:text-primary transition-colors">
                            {doc.uploadedBy?.fullName || "Anonymous"}
                          </span>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tight leading-none mt-0.5">
                            Uploader
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors shrink-0">
                        <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-[16px]">
                            visibility
                          </span>
                          {doc.views || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center py-6">
                <Pagination
                  current={currentPage}
                  total={totalDocs}
                  pageSize={pageSize}
                  onChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
            </>
          ) : (
            <div className="py-20 text-center bg-white dark:bg-[#1a202c] rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
              <Empty
                description={
                  <span className="text-gray-500 font-bold">
                    No documents match your filter
                  </span>
                }
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ExploreDocs;
