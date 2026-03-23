import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Modal, Popover } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "../../styles/sidebar-popover.css";

const ClientSidebar = () => {
  const { user, logout } = useAuth();

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

  return (
    <aside className="w-72 shrink-0 flex flex-col border-r border-[#e6e8eb] dark:border-gray-800 bg-white dark:bg-[#1a202c] h-full overflow-y-auto hidden lg:flex">
      <div className="p-6 flex flex-col h-full justify-between">
        <div className="flex flex-col gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex items-center justify-center rounded-xl size-10 text-primary cursor-pointer select-none">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-none tracking-tight cursor-pointer select-none">
                SmartShare AI
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium pt-1 cursor-pointer select-none">
                Student Platform
              </p>
            </div>
          </div>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`
              }
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                home
              </span>
              <span className="text-sm font-semibold">Home</span>
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/library"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`
                  }
                >
                  <span className="material-symbols-outlined">menu_book</span>
                  <span className="text-sm font-medium">My Library</span>
                </NavLink>

                <NavLink
                  to="/uploads"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`
                  }
                >
                  <span className="material-symbols-outlined">
                    cloud_upload
                  </span>
                  <span className="text-sm font-medium">Uploads</span>
                </NavLink>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`
                  }
                >
                  <span className="material-symbols-outlined">favorite</span>
                  <span className="text-sm font-medium">Favorites</span>
                </NavLink>
              </>
            )}
            {!user && (
              <NavLink
                to="/help-center"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`
                }
              >
                <span className="material-symbols-outlined">help</span>
                <span className="text-sm font-medium">Help Center</span>
              </NavLink>
            )}
          </nav>
          {/* Divider */}
          {user && (
            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
          )}
          {/* Secondary Links */}
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Settings
                </p>
                <NavLink
                  to="/preferences"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`
                  }
                >
                  <span className="material-symbols-outlined">settings</span>
                  <span className="text-sm font-medium">Preferences</span>
                </NavLink>
                <NavLink
                  to="/help-center"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`
                  }
                >
                  <span className="material-symbols-outlined">help</span>
                  <span className="text-sm font-medium">Help Center</span>
                </NavLink>
              </>
            ) : (
              <>
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 dark:border-primary/30">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <span className="material-symbols-outlined text-[20px]">
                      rocket_launch
                    </span>
                    <span className="font-bold text-sm">Join SmartShare</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                    Unlock your personal library, share documents, and join
                    study groups today.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        {/* CTA & User Profile */}
        <div className="flex flex-col gap-4">
          {user ? (
            <Popover
              content={
                <div className="flex flex-col gap-1 min-w-[160px]">
                  {user?.role === "admin" && (
                    <NavLink
                      to="/admin"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        dashboard
                      </span>
                      Admin Dashboard
                    </NavLink>
                  )}
                  <NavLink
                    to="/preferences"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      settings
                    </span>
                    Preferences
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors w-full text-left"
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
              overlayClassName="sidebar-user-popover"
            >
              <div className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=3b82f6&color=fff`
                    }
                    alt="User Avatar"
                    className="object-cover rounded-full size-10 ring-2 ring-gray-100 dark:ring-gray-700 shrink-0"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-bold truncate dark:text-white">
                      {user.fullName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </Popover>
          ) : (
            <div className="flex flex-col gap-2">
              <NavLink
                to="/login"
                className="flex items-center justify-center w-full h-10 px-4 text-sm font-bold text-white transition-all rounded-lg bg-primary hover:brightness-110 active:scale-95"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className="flex items-center justify-center w-full h-10 px-4 text-sm font-bold transition-all border rounded-lg text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
export default ClientSidebar;
