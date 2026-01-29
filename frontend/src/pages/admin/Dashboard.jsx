import { useEffect, useState } from "react";
import TopSearchBar from "../../components/TopSearchBar/TopSearchBar";
import DocumentCard from "../../components/DocumentCard/DocumentCard";
import { getDashboardStatsApi, getDocumentsApi } from "../../services/api";

import { Spin } from "antd";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0 },
    documents: { total: 0, pending: 0 },
    categories: { total: 0 },
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // ... existing code
      try {
        const [statsRes, docsRes] = await Promise.all([
          getDashboardStatsApi(),
          getDocumentsApi(),
        ]);

        if (statsRes && statsRes.statusCode === 200) {
          setStats(statsRes.data);
        }
        if (docsRes && docsRes.statusCode === 200) {
          setRecentDocs(docsRes.data.slice(0, 3)); // Take top 3
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats.users.total,
      icon: "👥",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Documents",
      value: stats.documents.total,
      icon: "📄",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Pending Reviews",
      value: stats.documents.pending,
      icon: "⏳",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Total Categories",
      value: stats.categories?.total || 0,
      icon: "🏷️",
      color: "bg-purple-50 text-purple-700",
    },
  ];

  if (loading)
    return (
      <div className="lg:ml-64 h-screen flex justify-center items-center bg-gray-50">
        <Spin size="large" tip="Loading..." />
      </div>
    );

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* TopSearchBar */}
        <div className="mb-6 md:mb-8">
          <TopSearchBar onSearch={handleSearch} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Documents (Now Recent Documents) */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Recent Documents
            </h2>
            <a
              href="/admin/documents"
              className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </a>
          </div>
          {recentDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {recentDocs.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={
                    // Mapping backend doc to DocumentCard props if needed
                    // Backend: { _id, title, description, fileType, size, uploadedAt, ... }
                    // Card expects: { id, title, description, type, size, uploadedAt, aiSummary }
                    {
                      id: doc._id,
                      title: doc.title,
                      description: doc.description,
                      type: doc.fileType,
                      size: formatBytes(doc.size),
                      uploadedAt: new Date(doc.createdAt).toLocaleDateString(),
                      aiSummary: "AI Summary not available yet",
                    }
                  }
                />
              ))}
            </div>
          ) : (
            <p>No documents found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
