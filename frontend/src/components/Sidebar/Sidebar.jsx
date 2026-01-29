import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Modal, Popover } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/categories", label: "Categories", icon: "🏷️" },
    { path: "/admin/documents", label: "Documents", icon: "📄" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/comments", label: "Comments", icon: "💬" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen flex flex-col bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        {/* App Name/Logo */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 cursor-pointer select-none">
            AI Learning Hub
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1 cursor-pointer select-none">
            Document Sharing Platform
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm md:text-base">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200">
          <Popover
            content={
              <div className="flex flex-col gap-1 min-w-[160px]">
                <NavLink
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    home
                  </span>
                  Back to Home
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                  Sign Out
                </button>
              </div>
            }
            trigger="click"
            placement="topLeft"
            overlayInnerStyle={{ padding: "8px" }}
          >
            <div className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-gray-100 shrink-0"
                  style={{
                    backgroundImage: `url("${user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAyywXwl8gB4T9Bg9qX9-leZ11D89IRurmjopEmaVLe8fb1_-XmfW1qUAPN3KTlfYeZLGrh9uOinAWO3tx9Cng6KTAzRaGPZO6ssq3XLlkWshY4TdFL5sT7304FdXjnyxvK-TQaIRgl4mIXVSqVdP7URgiFAnEZwYQsjE2ChCLfk5RkWy9766mMFa_vVjnxX4UQP02KzTlFdpcxCUh_GQw3qsS1e_soqV_xAd8Us7trwMTUApJxzEI99yqJ4z0-NIcLKFutPvmtQkg"}")`,
                  }}
                ></div>
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-bold truncate text-gray-900">
                    {user?.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
