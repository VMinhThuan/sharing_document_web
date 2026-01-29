const userService = require("../services/user.service");
const { successResponse, errorResponse } = require("../utils/response");

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query);
    successResponse(res, 200, "Users retrieved", users);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    successResponse(res, 200, "User details retrieved", user);
  } catch (error) {
    errorResponse(res, 404, error.message, error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    successResponse(res, 201, "User created successfully", user);
  } catch (error) {
    errorResponse(res, 400, "Create user failed", error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    successResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    errorResponse(res, 400, "Update user failed", error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    errorResponse(res, 400, "Delete user failed", error.message);
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const result = await userService.toggleUserStatus(req.params.id);
    successResponse(res, 200, "User status toggled", result);
  } catch (error) {
    errorResponse(res, 400, "Action failed", error.message);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
};
