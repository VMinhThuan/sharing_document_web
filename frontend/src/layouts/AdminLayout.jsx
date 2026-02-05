import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Button,
} from "antd";
import {
  DashboardOutlined,
  BarChartOutlined,
  FileTextOutlined,
  CommentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Modal.confirm({
      title: "Sign Out",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to sign out?",
      okText: "Sign Out",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      centered: true,
      onOk: () => logout(),
    });
  };

  const menuItems = [
    {
      key: "/admin/analytics",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: "Users Management",
    },
    {
      key: "/admin/categories",
      icon: <TagsOutlined />,
      label: "Categories Management",
    },
    {
      key: "/admin/documents",
      icon: <FileTextOutlined />,
      label: "Documents Management",
    },
    {
      key: "/admin/comments",
      icon: <CommentOutlined />,
      label: "Comments Management",
    },
  ];

  const userMenuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Back to Home",
      onClick: () => navigate("/"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        className="shadow-lg border-r border-gray-200"
      >
        <div
          className="p-4 border-b border-gray-200"
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 m-0">
                AI Learning Hub
              </h1>
              <p className="text-xs text-gray-500 m-0">Admin Panel</p>
            </div>
          )}
          {collapsed && (
            <div className="text-xl font-bold text-gray-900">AH</div>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 80 : 250, transition: "all 0.2s" }}
      >
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space
              style={{ cursor: "pointer", padding: "0 10px" }}
              className="hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Avatar
                src={
                  user?.avatar ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAyywXwl8gB4T9Bg9qX9-leZ11D89IRurmjopEmaVLe8fb1_-XmfW1qUAPN3KTlfYeZLGrh9uOinAWO3tx9Cng6KTAzRaGPZO6ssq3XLlkWshY4TdFL5sT7304FdXjnyxvK-TQaIRgl4mIXVSqVdP7URgiFAnEZwYQsjE2ChCLfk5RkWy9766mMFa_vVjnxX4UQP02KzTlFdpcxCUh_GQw3qsS1e_soqV_xAd8Us7trwMTUApJxzEI99yqJ4z0-NIcLKFutPvmtQkg"
                }
                icon={<UserOutlined />}
                size="default"
              />
              {!collapsed && (
                <div style={{ textAlign: "right" }}>
                  <Text strong style={{ display: "block", fontSize: 14 }}>
                    {user?.fullName || "Admin"}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ display: "block", fontSize: 12 }}
                  >
                    {user?.email}
                  </Text>
                </div>
              )}
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px",
            padding: 24,
            background: "#f0f2f5",
            minHeight: "calc(100vh - 112px)",
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
