const dashboardService = require("../services/dashboard.service");
const { successResponse, errorResponse } = require("../utils/response");

const getStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    successResponse(res, 200, "Dashboard statistics retrieved", stats);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

module.exports = {
  getStats,
};
