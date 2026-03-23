import { useEffect, useState } from "react";
import { Row, Col, Spin, message } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import {
  getDashboardStatsApi,
  getDocumentsApi,
  getUsersApi,
} from "../../services/api";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    newUsersThisMonth: 0,
    uploadsThisMonth: 0,
    monthlyUsers: [],
    monthlyUploads: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsRes, docsRes, usersRes] = await Promise.all([
        getDashboardStatsApi(),
        getDocumentsApi(),
        getUsersApi(),
      ]);

      if (statsRes && statsRes.statusCode === 200) {
        const data = statsRes.data;

        // Calculate monthly stats
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter users created this month
        const users = usersRes?.data || [];
        const newUsersThisMonth = users.filter((user) => {
          const createdDate = new Date(user.createdAt);
          return (
            createdDate.getMonth() === currentMonth &&
            createdDate.getFullYear() === currentYear
          );
        }).length;

        // Filter documents uploaded this month
        const documents = docsRes?.data?.docs || [];
        const uploadsThisMonth = documents.filter((doc) => {
          const createdDate = new Date(doc.createdAt);
          return (
            createdDate.getMonth() === currentMonth &&
            createdDate.getFullYear() === currentYear
          );
        }).length;

        // Calculate monthly data for last 6 months
        const monthlyUsers = calculateMonthlyData(users, 6);
        const monthlyUploads = calculateMonthlyData(documents, 6);

        setStats({
          totalUsers: data.users?.total || 0,
          totalDocuments: data.documents?.total || 0,
          newUsersThisMonth,
          uploadsThisMonth,
          monthlyUsers,
          monthlyUploads,
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
      message.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyData = (items, monthsCount) => {
    const result = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const count = items.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === date.getMonth() &&
          itemDate.getFullYear() === date.getFullYear()
        );
      }).length;

      result.push({ month: monthName, count });
    }

    return result;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Loading analytics..." />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <UserOutlined />,
      color: "bg-blue-50 text-blue-700",
      description: "Registered members",
    },
    {
      label: "Total Documents",
      value: stats.totalDocuments,
      icon: <FileTextOutlined />,
      color: "bg-green-50 text-green-700",
      description: "Shared resources",
    },
    {
      label: "New Users (This Month)",
      value: stats.newUsersThisMonth,
      icon: <ArrowUpOutlined />,
      color: "bg-indigo-50 text-indigo-700",
      description: "Growth rate",
    },
    {
      label: "Uploads (This Month)",
      value: stats.uploadsThisMonth,
      icon: <CloudUploadOutlined />,
      color: "bg-orange-50 text-orange-700",
      description: "Recent activity",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Analytics</h1>
        <p className="text-gray-500">View real-time statistics and trends</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${stat.color}`}
              >
                {stat.icon}
              </div>
              <span
                className={`text-sm font-medium ${stats.totalUsers > 0 ? "text-green-600" : "text-gray-400"}`}
              >
                {/* Placeholder for trending info if available */}
              </span>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Charts */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">
              New Users Growth
            </h3>
            <div className="space-y-6">
              {stats.monthlyUsers.map((item, index) => (
                <div key={index} className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-600">
                      {item.month}
                    </div>
                    <div className="text-sm font-bold text-blue-600">
                      {item.count}
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-50">
                    <div
                      style={{
                        width: `${
                          stats.monthlyUsers.length > 0
                            ? (item.count /
                                Math.max(
                                  ...stats.monthlyUsers.map((m) => m.count),
                                  1,
                                )) *
                              100
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">
              Document Upload Trends
            </h3>
            <div className="space-y-6">
              {stats.monthlyUploads.map((item, index) => (
                <div key={index} className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-600">
                      {item.month}
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      {item.count}
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-50">
                    <div
                      style={{
                        width: `${
                          stats.monthlyUploads.length > 0
                            ? (item.count /
                                Math.max(
                                  ...stats.monthlyUploads.map((m) => m.count),
                                  1,
                                )) *
                              100
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
