import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, getMeApi, logoutApi } from "../services/api";
import { Spin, message } from "antd";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const res = await getMeApi();
        if (res && res.statusCode === 200) {
          setUser(res.data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("accessToken");
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    if (res && res.statusCode === 200) {
      message.success("Logged in successfully");
      localStorage.setItem("accessToken", res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      return res; // Success
    }
    return res; // Failure
  };

  const logout = async () => {
    try {
      const res = await logoutApi();
      if (res && res.statusCode === 200) {
        localStorage.removeItem("accessToken");
        setUser(null);
        setIsAuthenticated(false);
        message.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      console.log("Logout API error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#1a202c] z-50">
          <Spin size="large" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
