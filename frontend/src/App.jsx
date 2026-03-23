import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminRoute from "./components/ProtectedRoute/AdminRoute";
import GuestRoute from "./components/ProtectedRoute/GuestRoute";
import UserRoute from "./components/ProtectedRoute/UserRoute";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import Analytics from "./pages/admin/Analytics";
import Documents from "./pages/admin/Documents";
import Categories from "./pages/admin/Categories";
import UploadDocument from "./pages/admin/UploadDocument";
import Users from "./pages/admin/Users";
import Comments from "./pages/admin/Comments";

// Client Pages
import Home from "./pages/client/Home";
import Library from "./pages/client/Library";
import Uploads from "./pages/client/Uploads";
import Favorites from "./pages/client/Favorites";
import Preferences from "./pages/client/Preferences";
import HelpCenter from "./pages/client/HelpCenter";
import LibraryDetail from "./pages/client/LibraryDetail";
import ExploreDocs from "./pages/client/ExploreDocs";
import ExploreDocsDetail from "./pages/client/ExploreDocsDetail";
import Search from "./pages/client/Search";
import AISuggestions from "./pages/client/AISuggestions";

// Auth & Error Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/error/NotFound";
import Forbidden from "./pages/error/Forbidden";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public Routes restricted for authenticated users */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="/403" element={<Forbidden />} />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route
                  index
                  element={<Navigate to="/admin/analytics" replace />}
                />
                <Route path="analytics" element={<Analytics />} />
                <Route path="documents" element={<Documents />} />
                <Route path="comments" element={<Comments />} />
                <Route path="documents/:id" element={<ExploreDocsDetail />} />
                <Route path="categories" element={<Categories />} />
                <Route path="upload" element={<UploadDocument />} />
                <Route path="users" element={<Users />} />
              </Route>
            </Route>

            {/* Client Routes */}
            <Route element={<ClientLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/documents" element={<ExploreDocs />} />
              <Route path="/search" element={<Search />} />
              <Route path="/documents/:id" element={<ExploreDocsDetail />} />
              <Route path="/help-center" element={<HelpCenter />} />

              {/* Private Client Routes */}
              <Route element={<UserRoute />}>
                <Route path="/library" element={<Library />} />
                <Route path="/library/:id" element={<LibraryDetail />} />
                <Route path="/uploads" element={<Uploads />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/ai-suggest-for-you" element={<AISuggestions />} />
              </Route>
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
