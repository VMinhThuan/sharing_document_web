const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { errorResponse } = require("../utils/response");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      return errorResponse(res, 401, "Not authorized", "Token failed");
    }
  }

  if (!token) {
    return errorResponse(
      res,
      401,
      "Not authorized, no token",
      "No token provided",
    );
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user.role || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `User role ${req.user.role} is not authorized to access this route`,
        "Forbidden",
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
