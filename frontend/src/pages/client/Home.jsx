import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getDocumentsApi,
  toggleFavoriteApi,
  getRecentlyViewedApi,
  getRecommendationsApi,
  getTrendingDocumentsApi,
} from "../../services/api";
import { Spin, message } from "antd";
import { formatFileType } from "../../utils/fileUtils";
import TopHeader from "../../components/TopHeader/TopHeader";

const formatTimeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const formatSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const Home = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [trendingDocs, setTrendingDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreDocs, setExploreDocs] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(true);

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

  const fetchExploreDocs = async () => {
    setExploreLoading(true);
    try {
      const res = await getDocumentsApi("approved", 10, 1);
      if (res && res.statusCode === 200) {
        setExploreDocs(res.data.docs || []);
      }
    } catch (error) {
      console.error("Failed to fetch explore docs:", error);
    } finally {
      setExploreLoading(false);
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setTrendingLoading(true);
      try {
        const [recs, trending, recent] = await Promise.all([
          getRecommendationsApi(10),
          getTrendingDocumentsApi(10),
          isAuthenticated ? getRecentlyViewedApi() : Promise.resolve({ statusCode: 200, data: [] }),
        ]);

        if (recs && recs.statusCode === 200) {
          setDocuments(recs.data.docs || []);
        }
        if (trending && trending.statusCode === 200) {
          setTrendingDocs(trending.data);
        }
        if (recent && recent.statusCode === 200) {
          setRecentlyViewed(recent.data);
        }
      } catch (error) {
        console.error("Home data error:", error);
      } finally {
        setLoading(false);
        setTrendingLoading(false);
      }
    };

    fetchHomeData();
    fetchExploreDocs();
  }, [isAuthenticated]);

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
      console.error("Toggle favorite error:", error);
    }
  };

  return (
    <main className="flex-1 bg-white dark:bg-background-dark min-h-full transition-colors pb-20 overflow-x-hidden relative">
      <TopHeader title="SmartShare AI" />
      
      <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-12">
        {/* Search Header */}
        <section className="relative h-[250px] md:h-[300px] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#EBF2FF] to-[#F5F9FF] dark:from-[#1e293b] dark:to-[#0f172a] p-8 md:p-12 flex flex-col justify-center transition-all">
          <div className="relative z-10 max-w-3xl space-y-6">
            <h1 className="text-[#111318] dark:text-white text-4xl md:text-5xl font-black tracking-tight leading-tight">
              What do you want to <br />
              <span className="text-primary italic font-serif">learn</span>{" "}
              today?
            </h1>
            <div className="relative group max-w-2xl">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary text-2xl group-focus-within:scale-110 transition-transform">
                search
              </span>
              <input
                type="text"
                placeholder="Ask a question or search for 'Calculus notes'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-800 border-none rounded-3xl text-sm md:text-base text-[#111318] dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 transition-all shadow-xl shadow-primary/5"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary dark:bg-primary-dark text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-2xl leading-none">
                  search
                </span>
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block pointer-events-none opacity-20 dark:opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
          </div>
        </section>

        <div className="xl:col-span-12 space-y-16">
          {/* Trending Now */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                  <span className="material-symbols-outlined text-2xl font-bold">
                    local_fire_department
                  </span>
                </div>
                <div>
                  <h2 className="text-[#111318] dark:text-white text-2xl md:text-3xl font-black leading-tight">
                    Trending Now
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-gray-500 font-bold">
                    Most viewed and downloaded this week
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("trending-carousel");
                    if (el) el.scrollBy({ left: -350, behavior: "smooth" });
                  }}
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("trending-carousel");
                    if (el) el.scrollBy({ left: 350, behavior: "smooth" });
                  }}
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            <div
              id="trending-carousel"
              className="flex gap-6 pb-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {trendingLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[280px] h-[300px] bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] animate-pulse" />
                ))
              ) : trendingDocs.length > 0 ? (
                trendingDocs.map((doc, idx) => (
                  <Link
                    key={doc._id}
                    to={`/documents/${doc._id}`}
                    className="group relative flex-shrink-0 w-[240px] md:w-[280px] bg-white dark:bg-[#1a202c] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-gray-800 p-3 hover:shadow-2xl transition-all duration-500 snap-start"
                  >
                    <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                      <div className="absolute top-3 left-3 z-10 size-8 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                        #{idx + 1}
                      </div>
                      {doc.fileType?.toLowerCase().includes("pdf") ? (
                        <span className="material-symbols-outlined text-4xl text-red-500/40">
                          picture_as_pdf
                        </span>
                      ) : doc.fileType?.toLowerCase().includes("image") ? (
                        <img
                          src={doc.fileUrl}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-blue-500/40">
                          description
                        </span>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <h3 className="font-extrabold text-[#111318] dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {doc.title}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                        <span>{doc.views} views</span>
                        <span className="text-primary font-black">
                          {formatFileType(doc.fileType)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="w-full py-10 text-center text-gray-500">
                  No trending documents yet.
                </div>
              )}
            </div>
          </section>

          {/* AI Recommendations */}
          {isAuthenticated && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary dark:bg-primary-dark text-white rounded-[1.25rem] shadow-lg shadow-primary/20 animate-pulse">
                    <span className="material-symbols-outlined text-2xl font-black">
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <h2 className="text-[#111318] dark:text-white text-2xl md:text-3xl font-black leading-tight flex items-center gap-3">
                      AI Picks For You
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-gray-500 font-bold">
                      Personalized materials based on your interests
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById("ai-picks-carousel");
                      if (el) el.scrollBy({ left: -350, behavior: "smooth" });
                    }}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">
                      chevron_left
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById("ai-picks-carousel");
                      if (el) el.scrollBy({ left: 350, behavior: "smooth" });
                    }}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">
                      chevron_right
                    </span>
                  </button>
                  <Link
                    className="text-sm font-semibold text-primary hover:text-blue-600 flex items-center gap-1 group ml-2"
                    to="/ai-suggest-for-you"
                  >
                    View All
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="flex gap-5 overflow-hidden">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[320px] h-[300px] bg-gray-100 dark:bg-gray-800 rounded-[2.8rem] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div
                  id="ai-picks-carousel"
                  className="flex gap-5 pb-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <Link
                        key={doc._id}
                        to={`/documents/${doc._id}`}
                        className="group bg-white dark:bg-[#1a202c] rounded-[2rem] border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col gap-3 flex-shrink-0 w-[320px] snap-start"
                      >
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {doc._matchPercentage && (
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-primary shadow-sm z-10 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">
                                thumb_up
                              </span>
                              {doc._matchPercentage}% Match
                            </div>
                          )}
                          {doc.fileType?.toLowerCase().includes("pdf") ? (
                            <span className="material-symbols-outlined text-4xl text-red-500/40 opacity-50">
                              picture_as_pdf
                            </span>
                          ) : doc.fileType?.toLowerCase().includes("image") ? (
                            <img
                              src={doc.fileUrl}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              alt={doc.title}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-4xl text-blue-500/40 opacity-50 text-[50px]">
                              description
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                              {doc.title}
                            </h3>
                            <span
                              className={`material-symbols-outlined transition-colors cursor-pointer flex-shrink-0 ml-2 ${
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
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {doc.description ||
                              "Browse through high-quality study materials tailored for your subjects."}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="w-full py-10 text-center text-gray-500 font-medium bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                      Update your Preferences to get AI recommendations!
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Explore Mode - Documents Carousel */}
          <section className="mt-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <span className="material-symbols-outlined text-2xl font-bold">
                    grid_view
                  </span>
                </div>
                <div>
                  <h2 className="text-[#111318] dark:text-white text-2xl md:text-3xl font-black leading-tight">
                    Explore Topics
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-gray-500 font-bold">
                    Newest documents for you to discover
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("topics-carousel");
                    if (el) el.scrollBy({ left: -350, behavior: "smooth" });
                  }}
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("topics-carousel");
                    if (el) el.scrollBy({ left: 350, behavior: "smooth" });
                  }}
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
                <Link
                  className="text-sm font-semibold text-primary hover:text-blue-600 flex items-center gap-1 group ml-2"
                  to="/documents"
                >
                  View All
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            {exploreLoading ? (
              <div className="flex gap-4 overflow-hidden">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="w-[240px] md:w-[300px] h-[350px] bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] animate-pulse shrink-0" />
                ))}
              </div>
            ) : (
              <div
                id="topics-carousel"
                className="flex gap-6 pb-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {exploreDocs.length > 0 ? (
                  exploreDocs.map((doc) => (
                    <Link
                      key={doc._id}
                      to={`/documents/${doc._id}`}
                      className="group relative flex flex-col bg-white dark:bg-[#1a202c] p-4 rounded-[2rem] border border-slate-100 dark:border-gray-800/50 hover:border-indigo-400 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex-shrink-0 w-[240px] md:w-[300px] snap-start"
                    >
                       <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                          {doc.fileType?.toLowerCase().includes("pdf") ? (
                            <span className="material-symbols-outlined text-4xl text-red-500/40">
                              picture_as_pdf
                            </span>
                          ) : doc.fileType?.toLowerCase().includes("image") ? (
                            <img src={doc.fileUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                          ) : (
                            <span className="material-symbols-outlined text-4xl text-blue-500/40">
                              article
                            </span>
                          )}
                          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-white/90 dark:bg-black/60 backdrop-blur text-[9px] font-black text-primary uppercase tracking-widest">
                             {formatFileType(doc.fileType)}
                          </div>
                       </div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-gray-500 line-clamp-2 min-h-[32px] mb-3 leading-relaxed">
                        {doc.description || "Explore this valuable resource shared by the student community."}
                      </p>
                      <div className="mt-auto pt-3 border-t border-slate-50 dark:border-gray-800 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="size-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[9px] font-bold text-indigo-600">
                              {doc.uploadedBy?.fullName?.charAt(0) || "U"}
                           </div>
                           <span className="text-[10px] font-bold text-slate-600 dark:text-gray-400 truncate max-w-[80px]">
                             {doc.uploadedBy?.fullName || "Anonymous"}
                           </span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            {doc.views || 0}
                         </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="w-full py-10 text-center text-gray-500">
                     No documents discovered yet.
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Recently Viewed */}
          {isAuthenticated && recentlyViewed.length > 0 && (
            <section className="mt-4">
              <h2 className="text-[#111318] dark:text-white text-xl font-black mb-6">
                Recently Viewed
              </h2>

              <div className="flex flex-col gap-3">
                {recentlyViewed.slice(0, 5).map((item) => {
                  const doc = item.document;
                  if (!doc) return null;
                  return (
                    <Link
                      key={doc._id}
                      to={`/documents/${doc._id}`}
                      className="group flex items-center bg-white dark:bg-[#1a202c] p-4 rounded-2xl border border-slate-100 dark:border-gray-800 hover:border-primary transition-all duration-300"
                    >
                      {/* Icon */}
                      <div
                        className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
                          doc.fileType?.toLowerCase().includes("pdf")
                            ? "bg-red-50 text-red-500"
                            : "bg-blue-50 text-blue-500"
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {doc.fileType?.toLowerCase().includes("pdf")
                            ? "picture_as_pdf"
                            : "article"}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="ml-4 flex-1 min-w-0">
                        <h3 className="font-bold text-[#111318] dark:text-white text-sm truncate group-hover:text-primary transition-colors">
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Viewed {formatTimeAgo(item.viewedAt)} • {formatSize(doc.size)}
                        </p>
                      </div>

                      {/* Category Tag */}
                      <div className="ml-4 shrink-0">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          {typeof doc.category === "object" ? doc.category?.name : "General"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
