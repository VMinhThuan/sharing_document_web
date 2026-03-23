const { successResponse, errorResponse } = require("../utils/response");
const authService = require("../services/auth.service");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    return successResponse(res, 201, "User registered successfully", user);
  } catch (error) {
    // Simple error handling validation
    if (error.message === "User already exists") {
      return errorResponse(res, 400, error.message, "User already exists");
    }
    return errorResponse(res, 400, "Registration failed", error.message);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        400,
        "Please provide email and password",
        "Missing credentials",
      );
    }

    const user = await authService.loginUser(email, password);
    return successResponse(res, 200, "User logged in successfully", user);
  } catch (error) {
    return errorResponse(res, 401, "Login failed", error.message);
  }
};

// @desc    Get user data
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    successResponse(res, 200, "User data retrieved", req.user);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Since we are using JWT, we can't really "logout" server-side without a blacklist
    // or short expiration which is more complex.
    // For now, we just return success and client deletes the token.
    // If using cookies, we would clear cookie here.
    // res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });

    return successResponse(res, 200, "User logged out successfully");
  } catch (error) {
    return errorResponse(res, 500, "Logout failed", error.message);
  }
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    // In production, we don't return the token, just success message
    // return successResponse(res, 200, "Email sent");
    return successResponse(res, 200, "Email sent", result); // Returning result for demo/testing
  } catch (error) {
    return errorResponse(res, 400, "Forgot password failed", error.message);
  }
};

// @desc    Reset Password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const user = await authService.resetPassword(
      req.params.resettoken,
      req.body.password,
    );
    return successResponse(res, 200, "Password reset successfully", user);
  } catch (error) {
    return errorResponse(res, 400, "Reset password failed", error.message);
  }
};

// @desc    Change Password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const user = await authService.changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword,
    );
    return successResponse(res, 200, "Password updated successfully", user);
  } catch (error) {
    return errorResponse(res, 400, "Update password failed", error.message);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/updateprofile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    return successResponse(res, 200, "Profile updated successfully", user);
  } catch (error) {
    return errorResponse(res, 400, "Update profile failed", error.message);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
};
