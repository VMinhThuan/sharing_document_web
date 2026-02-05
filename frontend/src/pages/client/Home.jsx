import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getDocumentsApi, toggleFavoriteApi } from "../../services/api";
import { Spin, message } from "antd";

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

const Home = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const res = await getDocumentsApi("approved");
        if (res && res.statusCode === 200) {
          // Take first 6 for home page
          setDocuments(res.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch home documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const getGreeting = () => {
    // Vietnam Time (UTC+7)
    const vnHour = (new Date().getUTCHours() + 7) % 24;
    if (vnHour >= 5 && vnHour < 12) return "Good Morning";
    if (vnHour >= 12 && vnHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <main className="flex-1 flex flex-col min-h-full relative">
      {/* Mobile Header (Visible only on small screens) */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1a202c] border-b border-gray-200 dark:border-gray-800 z-20">
        <div className="flex items-center gap-2">
          <div className="text-primary bg-primary/10 p-1.5 rounded-lg">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <span className="font-bold text-lg">SmartShare AI</span>
        </div>
        <button className="text-gray-600 dark:text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      {/* Scrollable Content Area */}
      <div className="bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto w-full pb-10">
          {/* Hero / Greeting Section */}
          {user && isAuthenticated && (
            <div className="pt-8 px-6 md:px-10 pb-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
                  {getGreeting()}, {user?.fullName} 👋
                </h1>
                <p className="text-[#60708a] dark:text-gray-400 text-base md:text-lg font-normal">
                  Ready to boost your knowledge today?
                </p>
              </div>
            </div>
          )}
          {/* Search Section */}
          <div className="px-6 md:px-10 py-6 sticky top-0 z-10 backdrop-blur-md bg-background-light/80 dark:bg-background-dark/80 transition-all duration-300">
            <div className="max-w-3xl">
              <label className="group flex flex-col w-full relative shadow-sm transition-all focus-within:shadow-md rounded-xl">
                <div className="flex w-full items-stretch rounded-xl h-14 bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden">
                  <div className="text-primary flex items-center justify-center pl-4 pr-2">
                    <span className="material-symbols-outlined animate-pulse">
                      colors_spark
                    </span>
                  </div>
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none bg-transparent border-none focus:ring-0 text-[#111318] dark:text-white placeholder:text-[#60708a] px-2 text-base font-normal leading-normal h-full"
                    placeholder="Ask a question or search for 'Calculus notes'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex items-center pr-2">
                    <button
                      onClick={handleSearch}
                      className="bg-primary hover:bg-blue-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined">search</span>
                    </button>
                  </div>
                </div>
              </label>
            </div>
          </div>
          {/* Content Grid */}
          <div className="flex flex-col gap-10 px-6 md:px-10">
            {/* AI Picks Section */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                  <h2 className="text-[#111318] dark:text-white text-xl md:text-2xl font-bold leading-tight">
                    AI Picks For You
                  </h2>
                </div>
                <Link
                  className="text-sm font-semibold text-primary hover:text-blue-600 flex items-center gap-1 group"
                  to="/documents"
                >
                  View All
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <Spin />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <Link
                        key={doc._id}
                        to={`/documents/${doc._id}`}
                        className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-3"
                      >
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-primary shadow-sm z-10 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              thumb_up
                            </span>
                            98% Match
                          </div>
                          {doc.fileType?.toLowerCase().includes("pdf") ? (
                            <span className="material-symbols-outlined text-4xl text-red-500/40 opacity-50">
                              picture_as_pdf
                            </span>
                          ) : doc.fileType?.toLowerCase().includes("image") ||
                            ["jpg", "jpeg", "png"].some((ext) =>
                              doc.fileType?.toLowerCase().includes(ext),
                            ) ? (
                            <img
                              src={doc.fileUrl}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              alt={doc.title}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-4xl text-blue-500/40 opacity-50">
                              description
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                              {doc.title}
                            </h3>
                            <span
                              className={`material-symbols-outlined transition-colors cursor-pointer ${
                                user?.favorites?.includes(doc._id)
                                  ? "text-red-500"
                                  : "text-gray-400 hover:text-red-500"
                              }`}
                              style={{
                                fontVariationSettings: `'FILL' ${user?.favorites?.includes(doc._id) ? 1 : 0}`,
                              }}
                              onClick={(e) => handleToggleFavorite(e, doc._id)}
                            >
                              favorite
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {doc.description ||
                              "Browse through high-quality study materials tailored for your subjects."}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 gap-3">
                          <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
                            <div className="bg-primary/10 rounded-full size-6 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                              {doc.uploadedBy?.fullName?.charAt(0) || "U"}
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                              {doc.uploadedBy?.fullName || "Anonymous"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-400 text-xs shrink-0">
                            <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-bold uppercase">
                              {formatFileType(doc.fileType)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-gray-500">
                      No documents recommended yet.
                    </div>
                  )}
                </div>
              )}
            </section>
            {/* Trending Topics Section */}
            <section>
              <h2 className="text-[#111318] dark:text-white text-xl font-bold leading-tight mb-5 px-1">
                🔥 Trending Topics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                  className="group relative flex flex-col justify-end h-32 p-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  href="#"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                    <span className="material-symbols-outlined text-[64px]">
                      school
                    </span>
                  </div>
                  <p className="font-bold text-lg relative z-10">Finals Prep</p>
                  <p className="text-xs text-blue-100 relative z-10">
                    450+ docs
                  </p>
                </a>
                <a
                  className="group relative flex flex-col justify-end h-32 p-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  href="#"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                    <span className="material-symbols-outlined text-[64px]">
                      code
                    </span>
                  </div>
                  <p className="font-bold text-lg relative z-10">Python</p>
                  <p className="text-xs text-purple-100 relative z-10">
                    320+ docs
                  </p>
                </a>
                <a
                  className="group relative flex flex-col justify-end h-32 p-4 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  href="#"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                    <span className="material-symbols-outlined text-[64px]">
                      psychology
                    </span>
                  </div>
                  <p className="font-bold text-lg relative z-10">Psychology</p>
                  <p className="text-xs text-emerald-100 relative z-10">
                    180+ docs
                  </p>
                </a>
                <a
                  className="group relative flex flex-col justify-end h-32 p-4 rounded-xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  href="#"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                    <span className="material-symbols-outlined text-[64px]">
                      history_edu
                    </span>
                  </div>
                  <p className="font-bold text-lg relative z-10">History 101</p>
                  <p className="text-xs text-orange-100 relative z-10">
                    210+ docs
                  </p>
                </a>
              </div>
            </section>
            {/* Recently Viewed (List View) */}
            <section>
              <h2 className="text-[#111318] dark:text-white text-xl font-bold leading-tight mb-4 px-1">
                Recently Viewed
              </h2>
              <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                  <div className="size-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                    <span className="material-symbols-outlined">
                      picture_as_pdf
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary">
                      Advanced Calculus - Week 4.pdf
                    </h4>
                    <p className="text-xs text-gray-500">
                      Viewed 2 hours ago • 4.5MB
                    </p>
                  </div>
                  <div className="hidden md:block text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                    Math
                  </div>
                </div>
                <div className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                  <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                    <span className="material-symbols-outlined">article</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary">
                      Project Management Finals.docx
                    </h4>
                    <p className="text-xs text-gray-500">
                      Viewed yesterday • 1.2MB
                    </p>
                  </div>
                  <div className="hidden md:block text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                    Business
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
