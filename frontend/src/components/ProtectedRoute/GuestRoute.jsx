import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const GuestRoute = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user.role === "USER") {
    return <Navigate to="/" replace />;
  } else if (isAuthenticated && user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
