const User = require("../models/user.model");
const Document = require("../models/document.model");
const Category = require("../models/category.model");

// --- Dashboard Stats ---
const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalDocuments = await Document.countDocuments();
  const pendingDocuments = await Document.countDocuments({ status: "pending" });
  const totalCategories = await Category.countDocuments();

  return {
    users: { total: totalUsers },
    documents: { total: totalDocuments, pending: pendingDocuments },
    categories: { total: totalCategories },
  };
};

module.exports = {
  getDashboardStats,
};
