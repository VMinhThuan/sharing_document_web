const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} = require("../utils/validation");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { getPasswordResetTemplate } = require("../utils/emailTemplates");

const getUserProfile = (user) => {
  return {
    _id: user.id || user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phoneNumber: user.phoneNumber,
    bio: user.bio,
    theme: user.theme,
    interests: user.interests || [],
    token: generateToken(user._id || user.id),
  };
};

const registerUser = async (userData) => {
  // Validate data
  const { error } = registerSchema.validate(userData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const { email, password, fullName, phoneNumber, interests } = userData;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  // Determine role (default is user, but good to check if passed)
  const role = userData.role || "user";

  const defaultUserAvatar =
    "https://res.cloudinary.com/dd1vwmybp/image/upload/v1769331398/cinejoy/ytbesgqnjpttdakgzja4.png";
  const defaultAdminAvatar =
    "https://res.cloudinary.com/dd1vwmybp/image/upload/v1769331398/cinejoy/hvlsr2aumuagwzwasc00.png";

  const avatar = role === "admin" ? defaultAdminAvatar : defaultUserAvatar;

  // Create user
  const user = await User.create({
    email,
    password,
    fullName,
    phoneNumber,
    role,
    avatar,
    interests: interests || [],
  });

  if (user) {
    return getUserProfile(user);
  } else {
    throw new Error("Invalid user data");
  }
};

const loginUser = async (email, password) => {
  // Validate data
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check if user is active
  if (user.isActive === false) {
    throw new Error("Your account has been deactivated");
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return getUserProfile(user);
};

const forgotPassword = async (email) => {
  const { error } = forgotPasswordSchema.validate({ email });
  if (error) throw new Error(error.details[0].message);

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("There is no user with that email");
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url (this should be sent via email, but for now we return it)
  // Ideally use nodemailer here
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = getPasswordResetTemplate(resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    return { resetToken, resetUrl };
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error("Email could not be sent");
  }
};

const resetPassword = async (resetToken, password) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid token");
  }

  // Validate password
  const { error } = resetPasswordSchema.validate({ password });
  if (error) throw new Error(error.details[0].message);

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return getUserProfile(user);
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const { error } = changePasswordSchema.validate({
    currentPassword,
    newPassword,
  });
  if (error) throw new Error(error.details[0].message);

  const user = await User.findById(userId).select("+password");

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    throw new Error("Incorrect current password");
  }

  user.password = newPassword;
  await user.save();

  return getUserProfile(user);
};

const updateProfile = async (userId, updateData) => {
  const { error } = updateProfileSchema.validate(updateData);
  if (error) throw new Error(error.details[0].message);

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Fields allowed to update
  const allowedFields = [
    "fullName",
    "phoneNumber",
    "bio",
    "avatar",
    "theme",
    "interests",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  await user.save();

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
