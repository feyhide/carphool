import Joi from "joi";
import mongoose from "mongoose";

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 6-20 characters long, include at least one numeric digit, one lowercase letter, and one uppercase letter.",
      "string.empty": "Password is required.",
    }),
  fullname: Joi.string().min(3).required(),
  username: Joi.string().min(3).required(),
});

const signInpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

const emailSchema = Joi.string().email().required();

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid JWT token format.",
      "string.empty": "Token is required.",
    }),
  newPassword: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 6-20 characters long, include at least one numeric digit, one lowercase letter, and one uppercase letter.",
      "string.empty": "New password is required.",
    }),
});

const validateResetPassword = validator(resetPasswordSchema);
const validateEmail = validator(emailSchema);
const validateSignin = validator(signInpSchema);
const validateSignup = validator(signUpSchema);
const validateOtp = validator(otpSchema);

export {
  validateResetPassword,
  validateEmail,
  validateSignup,
  validateOtp,
  validateSignin,
};
