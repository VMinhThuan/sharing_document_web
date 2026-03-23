const Joi = require("joi");

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const passwordError =
  "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character";

const registerSchema = Joi.object({
  fullName: Joi.string().required().trim().messages({
    "string.empty": "Full name is required",
  }),
  email: Joi.string().email().required().trim().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().pattern(passwordPattern).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base": passwordError,
  }),
  phoneNumber: Joi.string().allow("").optional(),
  interests: Joi.array().items(Joi.string()).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().trim().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().pattern(passwordPattern).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base": passwordError,
  }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
  }),
  newPassword: Joi.string().pattern(passwordPattern).required().messages({
    "string.empty": "New password is required",
    "string.pattern.base": passwordError,
  }),
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().messages({
    "string.empty": "Full name cannot be empty",
  }),
  phoneNumber: Joi.string().allow("").optional(),
  bio: Joi.string().allow("").max(500).optional(),
  avatar: Joi.string().allow("").optional(),
  theme: Joi.string().valid("light", "dark", "system").optional(),
  interests: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
};
