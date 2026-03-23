const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please add a full name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  avatar: {
    type: String,
    default: "", // URL to avatar image
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: "",
  },
  bio: {
    type: String,
    default: "",
    maxlength: 500,
  },
  points: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  storageUsed: {
    type: Number, // in bytes
    default: 0,
  },
  lastLogin: {
    type: Date,
  },
  theme: {
    type: String,
    enum: ["light", "dark", "system"],
    default: "system",
  },
  interests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
  recentlyViewed: [
    {
      document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
      viewedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const crypto = require("crypto");
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
