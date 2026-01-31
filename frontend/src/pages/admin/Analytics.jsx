import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, message } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { getDashboardStatsApi, getDocumentsApi, getUsersApi } from "../../services/api";

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
        const documents = docsRes?.data || [];
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
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Analytics</h1>
        <p className="text-gray-500">View statistics and trends</p>
      </div>

      {/* Overview Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Documents"
              value={stats.totalDocuments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="New Users (This Month)"
              value={stats.newUsersThisMonth}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Uploads (This Month)"
              value={stats.uploadsThisMonth}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Monthly Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="New Users Per Month" className="h-full">
            <div className="space-y-3">
              {stats.monthlyUsers.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          stats.monthlyUsers.length > 0
                            ? (item.count /
                                Math.max(...stats.monthlyUsers.map((m) => m.count), 1)) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Document Uploads Per Month" className="h-full">
            <div className="space-y-3">
              {stats.monthlyUploads.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          stats.monthlyUploads.length > 0
                            ? (item.count /
                                Math.max(...stats.monthlyUploads.map((m) => m.count), 1)) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
