import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getDocumentByIdApi,
  toggleFavoriteApi,
  addRecentlyViewedApi,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Spin, Empty, message } from "antd";
import { formatDateVN } from "../../utils/dateUtils";

const LibraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser, isAuthenticated } = useAuth();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

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
          // Add to recently viewed if authenticated
          if (isAuthenticated) {
            addRecentlyViewedApi(id).catch((err) =>
              console.error("Failed to add to recently viewed:", err),
            );
          }
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
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-500 font-medium tracking-wide">
            Initializing secure document viewer...
          </p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Empty description="Document not found" />
      </div>
    );
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Document Header Area */}
        <header className="bg-white dark:bg-[#151c27] border-b border-slate-200 dark:border-slate-800 z-10 shrink-0 shadow-sm">
          {/* Breadcrumbs & Meta */}
          <div className="px-8 pt-6 pb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
              <Link
                className="hover:text-primary transition-colors flex items-center gap-1"
                to="/library"
              >
                <span className="material-symbols-outlined text-[18px]">
                  library_books
                </span>
                Library
              </Link>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="hover:text-primary cursor-pointer transition-colors">
                {typeof document.category === "object"
                  ? document.category?.name
                  : "Library"}
              </span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[200px]">
                {document.title}
              </span>
            </div>
            <div className="flex flex-wrap justify-between items-end gap-6">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                  {document.title}
                </h1>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uploaded on {formatDateVN(document.createdAt)}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-primary/10 dark:text-primary border border-blue-100 dark:border-primary/20 uppercase tracking-wider">
                    {document.fileType || "FILE"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
                    user?.favorites?.includes(id)
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
                  }`}
                  title={
                    user?.favorites?.includes(id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings: `'FILL' ${user?.favorites?.includes(id) ? 1 : 0}`,
                    }}
                  >
                    favorite
                  </span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    share
                  </span>
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 text-sm font-bold shadow-lg shadow-primary/20 transition-all border border-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    edit
                  </span>
                  Edit Details
                </button>
              </div>
            </div>
          </div>
          {/* Toolbar */}
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <button className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </button>
              <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-30"
                disabled={zoom <= 50}
              >
                <span className="material-symbols-outlined text-[20px]">
                  remove
                </span>
              </button>
              <span className="px-3 text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[5ch] text-center tabular-nums">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-30"
                disabled={zoom >= 200}
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-none hover:shadow-sm transition-all"
                title="Print"
              >
                <span className="material-symbols-outlined text-[20px]">
                  print
                </span>
              </button>
              <button
                onClick={() => window.open(document.fileUrl, "_blank")}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-none hover:shadow-sm transition-all"
                title="Download"
              >
                <span className="material-symbols-outlined text-[20px]">
                  download
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Document Viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-100/30 dark:bg-[#0d121c] p-10 flex justify-center relative no-scrollbar">
          {/* Background pattern for depth */}
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
            style={{
              backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          ></div>

          {/* The Document Page Container */}
          <div
            className="relative w-full max-w-[900px] transition-all duration-300 origin-top"
            style={{
              transform: `scale(${zoom / 100})`,
              marginBottom: `${zoom > 100 ? (zoom - 100) * 5 : 0}px`,
            }}
          >
            <div className="bg-white dark:bg-[#1e1e1e] shadow-2xl dark:shadow-black/60 rounded-lg min-h-[1100px] ring-1 ring-slate-900/5 dark:ring-white/5 overflow-hidden flex flex-col">
              {/* Document Content Rendering based on File Type */}
              {(() => {
                const type = document.fileType?.toLowerCase() || "";

                if (type.includes("pdf")) {
                  return (
                    <div className="flex-1 flex flex-col">
                      <iframe
                        src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/documents/view/${document._id}?token=${localStorage.getItem("accessToken")}#toolbar=0`}
                        className="w-full h-full border-none min-h-[1100px]"
                        title={document.title}
                      />
                    </div>
                  );
                }

                if (
                  type.includes("image") ||
                  ["jpg", "jpeg", "png", "webp", "gif"].some((ext) =>
                    type.includes(ext),
                  )
                ) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-start p-8 bg-slate-50 dark:bg-slate-900/50">
                      <img
                        src={document.fileUrl}
                        alt={document.title}
                        className="max-w-full h-auto shadow-2xl rounded-lg border border-slate-200 dark:border-slate-700"
                        style={{ maxHeight: "1000px" }}
                      />
                      <div className="mt-8 w-full max-w-3xl">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                          Image Description
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                          {document.description ||
                            "No specific description provided for this image."}
                        </p>
                      </div>
                    </div>
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
                    <div className="flex-1 flex flex-col">
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.fileUrl)}&embedded=true`}
                        className="w-full h-full border-none min-h-[1100px]"
                        title={document.title}
                      />
                    </div>
                  );
                }

                // Default for DOCX, XLSX, etc.
                return (
                  <div className="p-16 md:p-24 flex flex-col gap-8 text-slate-800 dark:text-slate-200 leading-relaxed text-lg">
                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                      <span className="material-symbols-outlined text-5xl text-blue-500">
                        {type.includes("word") || type.includes("docx")
                          ? "description"
                          : type.includes("presentation") ||
                              type.includes("pptx")
                            ? "slideshow"
                            : type.includes("spreadsheet") ||
                                type.includes("xlsx")
                              ? "table_chart"
                              : "article"}
                      </span>
                      <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {document.title}
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <p className="text-justify text-slate-600 dark:text-slate-400 drop-shadow-sm font-medium">
                        {document.description ||
                          "This document type is not available for direct preview. Please use the download or print buttons to view the full content on your local system."}
                      </p>

                      {document.aiAnalysis?.summary && (
                        <div className="my-10 p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border-l-[6px] border-primary shadow-sm ring-1 ring-blue-100 dark:ring-blue-900/30">
                          <div className="flex items-center gap-2 mb-4 text-primary">
                            <span className="material-symbols-outlined text-[24px]">
                              auto_awesome
                            </span>
                            <h3 className="text-lg font-bold uppercase tracking-wider">
                              AI Executive Summary
                            </h3>
                          </div>
                          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-loose italic">
                            "{document.aiAnalysis.summary}"
                          </p>
                        </div>
                      )}

                      {document.aiAnalysis?.keyPoints &&
                        document.aiAnalysis.keyPoints.length > 0 && (
                          <div className="space-y-6 mt-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="w-2 h-6 bg-primary rounded-full"></span>
                              Key Insights
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {document.aiAnalysis.keyPoints.map(
                                (point, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-3 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <span className="material-symbols-outlined text-primary text-lg">
                                      check_circle
                                    </span>
                                    <span className="text-sm font-medium leading-normal">
                                      {point}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer in viewport */}
            <div className="mt-8 mb-16 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                End of Document Preview • Generated by SmartShare AI
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LibraryDetail;
