import createInstanceAxios from "./axios.customize";

const axios = createInstanceAxios(import.meta.env.VITE_BACKEND_URL);

// --- Auth ---
export const registerApi = (
  email,
  password,
  fullName,
  phoneNumber,
  interests,
) => {
  return axios.post("/api/v1/auth/register", {
    email,
    password,
    fullName,
    phoneNumber,
    interests,
  });
};

export const loginApi = (email, password) => {
  return axios.post("/api/v1/auth/login", { email, password });
};

export const getMeApi = () => {
  return axios.get("/api/v1/auth/me");
};

export const logoutApi = () => {
  return axios.post("/api/v1/auth/logout");
};

export const forgotPasswordApi = (email) => {
  return axios.post("/api/v1/auth/forgotpassword", { email });
};

export const resetPasswordApi = (token, password) => {
  return axios.put(`/api/v1/auth/resetpassword/${token}`, { password });
};

export const updatePasswordApi = (currentPassword, newPassword) => {
  return axios.put("/api/v1/auth/updatepassword", {
    currentPassword,
    newPassword,
  });
};

export const updateProfileApi = (userData) => {
  return axios.put("/api/v1/auth/updateprofile", userData);
};

export const uploadFileApi = (formData) => {
  return axios.post("/api/v1/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// --- Dashboard ---
export const getDashboardStatsApi = () => {
  return axios.get("/api/v1/dashboard/stats");
};

// --- Users (Admin) ---
export const getUsersApi = (query) => {
  return axios.get(`/api/v1/users?${query || ""}`);
};

export const createUserApi = (userData) => {
  return axios.post("/api/v1/users", userData);
};

export const updateUserApi = (id, userData) => {
  return axios.put(`/api/v1/users/${id}`, userData);
};

export const deleteUserApi = (id) => {
  return axios.delete(`/api/v1/users/${id}`);
};

export const toggleUserStatusApi = (id) => {
  return axios.put(`/api/v1/users/${id}/toggle-status`);
};

// --- Documents (Admin) ---
export const getDocumentsApi = (status, limit = 10, page = 1) => {
  return axios.get(
    `/api/v1/documents?status=${status || ""}&limit=${limit}&page=${page}`,
  );
};

export const searchDocumentsApi = (query, limit = 12, page = 1) => {
  return axios.get(
    `/api/v1/documents/search?q=${query || ""}&limit=${limit}&page=${page}`,
  );
};

export const getMyDocumentsApi = (status, limit = 10, page = 1) => {
  return axios.get(
    `/api/v1/documents/me?status=${status || ""}&limit=${limit}&page=${page}`,
  );
};

export const toggleFavoriteApi = (id) => {
  return axios.post(`/api/v1/documents/favorites/${id}`);
};

export const getFavoritesApi = () => {
  return axios.get("/api/v1/documents/favorites");
};

export const addRecentlyViewedApi = (id) => {
  return axios.post(`/api/v1/documents/recent/${id}`);
};

export const getRecentlyViewedApi = () => {
  return axios.get("/api/v1/documents/recent");
};

export const getRecommendationsApi = (limit = 6, page = 1) => {
  return axios.get(`/api/v1/documents/recommendations?limit=${limit}&page=${page}`);
};

export const getTrendingDocumentsApi = (limit = 10) => {
  return axios.get(`/api/v1/documents/trending?limit=${limit}`);
};

export const getDocumentByIdApi = (id) => {
  return axios.get(`/api/v1/documents/${id}`);
};

export const recordDownloadApi = (id) => {
  return axios.post(`/api/v1/documents/download/${id}`);
};

export const approveDocumentApi = (id) => {
  return axios.put(`/api/v1/documents/${id}/approve`);
};

export const rejectDocumentApi = (id) => {
  return axios.put(`/api/v1/documents/${id}/reject`);
};

export const createDocumentApi = (formData) => {
  return axios.post("/api/v1/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateDocumentApi = (id, data) => {
  return axios.put(`/api/v1/documents/${id}`, data);
};

export const deleteDocumentApi = (id) => {
  return axios.delete(`/api/v1/documents/${id}`);
};

// --- Score Management (Admin) ---
export const setDocumentScoreApi = (id, score, reason = "") => {
  return axios.put(`/api/v1/documents/${id}/score`, { score, reason });
};

export const getScoreHistoryApi = (id) => {
  return axios.get(`/api/v1/documents/${id}/score-history`);
};

export const recalculateAllScoresApi = () => {
  return axios.post("/api/v1/documents/scores/recalculate");
};

export const getScoreAnalyticsApi = () => {
  return axios.get("/api/v1/documents/scores/analytics");
};

// --- Categories (Admin) ---
export const getCategoriesApi = () => {
  return axios.get("/api/v1/categories");
};

export const createCategoryApi = (data) => {
  return axios.post("/api/v1/categories", data);
};

export const updateCategoryApi = (id, data) => {
  return axios.put(`/api/v1/categories/${id}`, data);
};

export const deleteCategoryApi = (id) => {
  return axios.delete(`/api/v1/categories/${id}`);
};

// --- Comments ---
export const getCommentsApi = () => {
  return axios.get("/api/v1/comments");
};

export const getDocumentCommentsApi = (documentId) => {
  return axios.get(`/api/v1/comments/document/${documentId}`);
};

export const createCommentApi = (
  documentId,
  content,
  parentCommentId = null,
) => {
  return axios.post("/api/v1/comments", {
    documentId,
    content,
    parentCommentId,
  });
};

export const deleteCommentApi = (id) => {
  return axios.delete(`/api/v1/comments/${id}`);
};

export const toggleCommentLikeApi = (id) => {
  return axios.post(`/api/v1/comments/${id}/like`);
};

export const getFavoriteCommentsApi = () => {
  return axios.get("/api/v1/comments/favorites/me");
};
