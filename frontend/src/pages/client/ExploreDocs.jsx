import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDocumentsApi } from "../../services/api";
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

const ExploreDocs = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await getDocumentsApi("approved");
        if (res && res.statusCode === 200) {
          setDocuments(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        message.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="px-8 py-10 bg-white dark:bg-[#1a202c] border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#111318] dark:text-white mb-2">
            Explore Documents
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Browse through all quality-checked and approved study materials.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12 no-scrollbar">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spin size="large" />
              <p className="mt-4 text-gray-500 font-medium">
                Loading documents...
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
                    {/* Visual representative icon based on file type */}
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
                      <span className="material-symbols-outlined text-gray-300 group-hover:text-red-400 transition-colors text-xl">
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
            <div className="py-20 flex justify-center">
              <Empty description="No approved documents available at the moment." />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ExploreDocs;
