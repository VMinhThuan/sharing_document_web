import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { searchDocumentsApi, toggleFavoriteApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Spin, Empty, message, Pagination } from "antd";
import { formatDateVN } from "../../utils/dateUtils";
import { formatFileType } from "../../utils/fileUtils";

const Search = () => {
  const { user, refreshUser, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const pageSize = 12;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      setCurrentPage(1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  useEffect(() => {
    setInputValue(query);
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = await searchDocumentsApi(query, pageSize, currentPage);
        if (res && res.statusCode === 200) {
          setDocuments(res.data.docs || []);
          setTotalDocs(res.data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        message.error("Failed to load search results");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setDocuments([]);
      setTotalDocs(0);
      setLoading(false);
    }
  }, [query, currentPage]);

  return (
    <main className="flex-1 flex flex-col min-h-full bg-[#f9fafb] dark:bg-background-dark pb-20">
      <header className="px-8 py-8 bg-white dark:bg-[#1a202c] border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-20 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors flex items-center justify-center shrink-0 border border-transparent dark:border-gray-700"
              title="Back to Home"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-[#111318] dark:text-white leading-tight">
                Search Results
              </h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                {loading ? "Searching documents..." : `${totalDocs} materials found`}
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <div className="flex w-full items-stretch rounded-2xl h-12 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 overflow-hidden transition-all">
                <div className="text-primary flex items-center justify-center pl-4 pr-2">
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                </div>
                <input
                  className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 text-sm text-[#111318] dark:text-white placeholder:text-gray-400 px-2"
                  placeholder="Ask a question or search for 'Calculus notes'..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex items-center pr-2">
                  <button
                    onClick={handleSearch}
                    className="bg-primary hover:bg-blue-600 text-white px-5 h-9 rounded-xl text-xs font-black transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    SEARCH
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {query && !loading && totalDocs > 0 && (
            <div className="mb-10 p-5 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-gray-800 rounded-3xl flex items-center justify-between shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Results for "<span className="text-primary font-black italic">{query}</span>"
              </p>
              <div className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-gray-800 px-3 py-1 rounded-full uppercase tracking-widest">
                Page {currentPage} of {Math.ceil(totalDocs / pageSize)}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <div className="relative">
                <Spin size="large" />
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                   <span className="material-symbols-outlined text-primary text-xl">search</span>
                </div>
              </div>
              <p className="mt-6 text-slate-500 font-black uppercase tracking-widest text-xs">
                Analyzing library...
              </p>
            </div>
          ) : documents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {documents.map((doc) => (
                  <Link
                    key={doc._id}
                    to={`/documents/${doc._id}`}
                    className="group bg-white dark:bg-[#1a202c] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-4 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                  >
                    <div className="relative aspect-video rounded-[1.8rem] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
                      {doc.fileType?.toLowerCase().includes("pdf") ? (
                        <span className="material-symbols-outlined text-5xl text-red-500/40 opacity-50">
                          picture_as_pdf
                        </span>
                      ) : doc.fileType?.toLowerCase().includes("image") ? (
                        <img
                          src={doc.fileUrl}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          alt={doc.title}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-5xl text-blue-500/40 opacity-50">
                          description
                        </span>
                      )}

                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-[9px] font-black bg-white/95 dark:bg-black/60 backdrop-blur-md rounded-lg shadow-sm text-primary uppercase tracking-widest border border-white/20">
                          {formatFileType(doc.fileType)}
                        </span>
                      </div>
                    </div>

                    <div className="px-1 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-lg">
                          {typeof doc.category === "object"
                            ? doc.category?.name
                            : "General"}
                        </span>
                        <button
                          className={`material-symbols-outlined transition-colors text-xl p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
                            user?.favorites?.includes(doc._id)
                              ? "text-red-500"
                              : "text-gray-300"
                          }`}
                          style={{
                            fontVariationSettings: `'FILL' ${user?.favorites?.includes(doc._id) ? 1 : 0}`,
                          }}
                          onClick={(e) => handleToggleFavorite(e, doc._id)}
                        >
                          favorite
                        </button>
                      </div>
                      <h3 className="font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-2 text-sm leading-snug h-10">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-bold mt-3 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">
                          visibility
                        </span>
                        {doc.views || 0} views
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-50 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden min-w-0 pr-2">
                        <div className="size-6 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                          {doc.uploadedBy?.fullName?.charAt(0) || "U"}
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-gray-400 truncate">
                          {doc.uploadedBy?.fullName || "Anonymous"}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-primary hover:translate-x-1 transition-transform cursor-pointer">
                        VIEW
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {totalDocs > pageSize && (
                <div className="flex justify-center mt-12 py-6">
                  <Pagination
                    current={currentPage}
                    total={totalDocs}
                    pageSize={pageSize}
                    onChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-white dark:bg-[#1a202c] rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800 shadow-sm">
              <Empty 
                imageStyle={{ height: 120 }}
                description={
                  <div className="space-y-4">
                     <p className="text-xl font-black text-slate-800 dark:text-white">
                        No matches discovered
                     </p>
                     <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">
                        We couldn't find any documents matching "<span className="font-bold text-slate-600 italic">{query}</span>".
                        Try different keywords or browse our library.
                     </p>
                  </div>
                } 
              />
              <Link
                to="/documents"
                className="mt-10 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                Browse All Documents
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Search;
