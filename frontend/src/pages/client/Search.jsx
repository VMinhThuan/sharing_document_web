import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { searchDocumentsApi, toggleFavoriteApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Spin, Empty, message } from "antd";
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

const Search = () => {
  const { user, refreshUser, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState(query);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
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
    setInputValue(query);
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = await searchDocumentsApi(query);
        if (res && res.statusCode === 200) {
          setDocuments(res.data);
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
      setLoading(false);
    }
  }, [query]);

  return (
    <main className="flex-1 flex flex-col min-h-full bg-background-light dark:bg-background-dark">
      <header className="px-8 py-8 bg-white dark:bg-[#1a202c] border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors flex items-center justify-center shrink-0"
              title="Back to Home"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-[#111318] dark:text-white leading-tight">
                Search Results
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                {loading ? "Searching..." : `${documents.length} results found`}
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <div className="flex w-full items-stretch rounded-xl h-11 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden transition-all">
                <div className="text-primary flex items-center justify-center pl-3 pr-1">
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
                <div className="flex items-center pr-1.5">
                  <button
                    onClick={handleSearch}
                    className="bg-primary hover:bg-blue-600 text-white px-4 h-8 rounded-lg text-xs font-bold transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {query && !loading && (
            <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found {documents.length} documents for "
                <span className="text-primary font-bold italic">{query}</span>"
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spin size="large" />
              <p className="mt-4 text-gray-500 font-medium">
                Searching documents...
              </p>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <Link
                  key={doc._id}
                  to={`/documents/${doc._id}`}
                  className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col gap-4"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    {doc.fileType?.toLowerCase().includes("pdf") ? (
                      <span className="material-symbols-outlined text-6xl text-red-500/40 group-hover:scale-110 transition-transform duration-500">
                        picture_as_pdf
                      </span>
                    ) : doc.fileType?.toLowerCase().includes("image") ||
                      ["jpg", "jpeg", "png"].some((ext) =>
                        doc.fileType?.toLowerCase().includes(ext),
                      ) ? (
                      <img
                        src={doc.fileUrl}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={doc.title}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-blue-500/40 group-hover:scale-110 transition-transform duration-500">
                        description
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 flex items-center gap-2 max-w-[80%]">
                      <span className="px-2 py-1 text-[10px] font-bold bg-white/90 dark:bg-black/70 backdrop-blur rounded shadow-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider truncate">
                        {formatFileType(doc.fileType)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/20">
                        {typeof doc.category === "object"
                          ? doc.category?.name
                          : "General"}
                      </span>
                      <span
                        className={`material-symbols-outlined transition-colors cursor-pointer text-xl ${
                          user?.favorites?.includes(doc._id)
                            ? "text-red-500"
                            : "text-gray-300 group-hover:text-red-400"
                        }`}
                        style={{
                          fontVariationSettings: `'FILL' ${user?.favorites?.includes(doc._id) ? 1 : 0}`,
                        }}
                        onClick={(e) => handleToggleFavorite(e, doc._id)}
                      >
                        favorite
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 md:h-12 leading-tight">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        calendar_today
                      </span>
                      {formatDateVN(doc.createdAt)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
                      <div className="size-6 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                        {doc.uploadedBy?.fullName?.charAt(0) || "U"}
                      </div>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 truncate">
                        {doc.uploadedBy?.fullName || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400 text-[10px] font-bold">
                      VIEW NOW
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <Empty description={`No results found for "${query}"`} />
              <Link
                to="/documents"
                className="mt-4 text-primary font-bold hover:underline"
              >
                Browse all documents
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Search;
