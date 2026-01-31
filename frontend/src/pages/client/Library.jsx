import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDocumentsApi, getCategoriesApi } from "../../services/api";
import { Spin, Empty, message, Tag } from "antd";
import { formatDateVN } from "../../utils/dateUtils";

const Library = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docsRes, catsRes] = await Promise.all([
          getMyDocumentsApi(),
          getCategoriesApi(),
        ]);

        if (docsRes && docsRes.statusCode === 200) {
          setDocuments(docsRes.data);
        }
        if (catsRes && catsRes.statusCode === 200) {
          setCategories(catsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch library data:", error);
        message.error("Failed to load your library");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (id) => {
    navigate(`/library/${id}`);
  };

  const getFileIcon = (type) => {
    const t = type?.toLowerCase();
    if (t?.includes("pdf")) return "picture_as_pdf";
    if (t?.includes("word") || t?.includes("docx")) return "description";
    if (
      t?.includes("presentation") ||
      t?.includes("pptx") ||
      t?.includes("powerpoint")
    )
      return "slideshow";
    if (t?.includes("spreadsheet") || t?.includes("xlsx") || t?.includes("csv"))
      return "table_chart";
    if (t?.includes("image")) return "image";
    return "article";
  };

  const getIconColor = (type) => {
    const t = type?.toLowerCase();
    if (t?.includes("pdf")) return "text-red-500 bg-red-50 dark:bg-red-900/10";
    if (t?.includes("word") || t?.includes("docx"))
      return "text-blue-500 bg-blue-50 dark:bg-blue-900/10";
    if (t?.includes("presentation") || t?.includes("pptx"))
      return "text-orange-500 bg-orange-50 dark:bg-orange-900/10";
    if (t?.includes("spreadsheet") || t?.includes("xlsx"))
      return "text-green-500 bg-green-50 dark:bg-green-900/10";
    if (t?.includes("image"))
      return "text-purple-500 bg-purple-50 dark:bg-purple-900/10";
    return "text-gray-500 bg-gray-50 dark:bg-gray-800";
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchText.toLowerCase());

    const categoryId =
      typeof doc.category === "object" ? doc.category?._id : doc.category;
    const matchesCategory =
      activeCategory === "all" || categoryId === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Get categories that actually have documents
  const usedCategoryIds = new Set(
    documents.map((doc) =>
      typeof doc.category === "object" ? doc.category?._id : doc.category,
    ),
  );

  const availableCategories = categories.filter((cat) =>
    usedCategoryIds.has(cat._id),
  );

  return (
    <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Library
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-2xl">
            Access all your study materials, lecture notes, and research papers
            in one organized place.
          </p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2.5 w-full md:w-64 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              placeholder="Search your library..."
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button className="p-2.5 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
          </button>
          <button className="p-2.5 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">
              grid_view
            </span>
          </button>
        </div>
      </header>

      <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory("all")}
          className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${activeCategory === "all" ? "border-primary text-primary" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
        >
          All Documents
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat._id)}
            className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${activeCategory === cat._id ? "border-primary text-primary" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">Loading your library...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="py-20 text-center">
          <Empty
            description={
              searchText
                ? "No documents match your search"
                : "No documents in this category"
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              onClick={() => handleItemClick(doc._id)}
              className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-100 dark:border-[#334155] p-5 hover:shadow-xl dark:hover:shadow-primary/10 transition-all duration-300 group relative cursor-pointer"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1 px-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    more_vert
                  </span>
                </button>
              </div>
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(doc.fileType)}`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {getFileIcon(doc.fileType)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-[15px] font-bold text-gray-900 dark:text-white truncate mb-1"
                    title={doc.title}
                  >
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-3">
                    <span className="font-medium">
                      {typeof doc.category === "object"
                        ? doc.category?.name
                        : categories.find((c) => c._id === doc.category)
                            ?.name || "Other"}
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span>{(doc.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {doc.aiAnalysis?.isAnalyzed ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                        Analyzed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-500/20">
                        Processing
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                      {doc.fileType?.toUpperCase() || "FILE"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  Edited {formatDateVN(doc.createdAt)}
                </span>
                <div className="flex space-x-1">
                  <button
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors"
                    title="Chat with AI"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      smart_toy
                    </span>
                  </button>
                  <button
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors"
                    title="Share"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      share
                    </span>
                  </button>
                  <button
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors"
                    title="View"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(doc._id);
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      visibility
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredDocs.length > 0 && (
        <div className="mt-10 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {filteredDocs.length}
            </span>{" "}
            results
          </div>
        </div>
      )}
    </main>
  );
};

export default Library;
