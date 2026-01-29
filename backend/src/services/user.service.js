const User = require("../models/user.model");

const getAllUsers = async (query) => {
  // Basic pagination logic could be added here
  return await User.find().select("-password").sort({ createdAt: -1 });
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const createUser = async (userData) => {
  const { email, password, role, fullName, phoneNumber } = userData;
  // Check exist
  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");

  // Default avatars
  const defaultUserAvatar =
    "https://res.cloudinary.com/dd1vwmybp/image/upload/v1769331398/cinejoy/ytbesgqnjpttdakgzja4.png";
  const defaultAdminAvatar =
    "https://res.cloudinary.com/dd1vwmybp/image/upload/v1769331398/cinejoy/hvlsr2aumuagwzwasc00.png";

  const userRole = role || "user";
  const avatar = userRole === "admin" ? defaultAdminAvatar : defaultUserAvatar;

  // Create
  const user = await User.create({
    email,
    password,
    role: userRole,
    fullName,
    phoneNumber,
    avatar,
  });
  return user;
};

const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return user;
};

const toggleUserStatus = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  user.isActive = !user.isActive;
  await user.save();
  return { _id: user._id, isActive: user.isActive };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
};
