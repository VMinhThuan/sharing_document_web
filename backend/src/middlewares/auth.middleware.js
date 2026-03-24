const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { errorResponse } = require("../utils/response");

const protect = async (req, res, next) => {
  let token;

  if (
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) ||
    req.query.token
  ) {
    try {
      token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : req.query.token;

      if (!token || token === 'null' || token === 'undefined') {
        return errorResponse(res, 401, "Not authorized, no token", "No token provided");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

const optionalProtect = async (req, res, next) => {
  let token;

  if (
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) ||
    req.query.token
  ) {
    try {
      token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : req.query.token;

      if (token && token !== 'null' && token !== 'undefined') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
      }
    } catch (error) {
      // Quietly fail for optional protect
    }
  }
  next();
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
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

module.exports = { protect, authorize, optionalProtect };
