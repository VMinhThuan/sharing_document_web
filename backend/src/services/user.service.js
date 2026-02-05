const User = require("../models/user.model");
const Document = require("../models/document.model");

const getAllUsers = async (query) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  // Get used storage for each user
  const userListWithStorage = await Promise.all(
    users.map(async (user) => {
      const docs = await Document.find({ uploadedBy: user._id });
      const totalUsedSize = docs.reduce((acc, doc) => acc + (doc.size || 0), 0);
      return {
        ...user.toObject(),
        totalUsedSize,
      };
    }),
  );

  return userListWithStorage;
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

const toggleFavorite = async (userId, documentId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const index = user.favorites.indexOf(documentId);
  if (index === -1) {
    user.favorites.push(documentId);
  } else {
    user.favorites.splice(index, 1);
  }

  await user.save();
  return user.favorites;
};

const getFavorites = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "favorites",
    populate: {
      path: "uploadedBy",
      select: "fullName avatar",
    },
  });
  if (!user) throw new Error("User not found");
  return user.favorites;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  toggleFavorite,
  getFavorites,
};
