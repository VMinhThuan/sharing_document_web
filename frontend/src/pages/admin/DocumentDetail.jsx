import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDocumentByIdApi } from "../../services/api";
import { Spin, Empty, message, Tag, Avatar } from "antd";
import { formatDateVN } from "../../utils/dateUtils";

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/40 min-h-screen">
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
              <button className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
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
                      src={document.uploadedBy?.avatar}
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
  );
};

export default DocumentDetail;
