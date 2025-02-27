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

const createRideSchema = Joi.object({
  vehicle: Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Vehicle name is required.",
    }),
    type: Joi.string().valid("bike", "car").required().messages({
      "string.empty": "Vehicle type is required.",
      "any.only": "Vehicle type must be 'bike' or 'car'.",
    }),
  }).required(),

  description: Joi.string().trim().optional().messages({
    "string.empty": "Description is optional.",
  }),

  city: Joi.string().trim().required().messages({
    "string.empty": "City is required.",
  }),

  pickUpPoint: Joi.string().trim().required().messages({
    "string.empty": "Pick-up location is required.",
  }),

  pickUpTime: Joi.date().iso().required().messages({
    "date.base": "Pick-up time must be a valid date.",
    "any.required": "Pick-up time is required.",
  }),

  destinationPoint: Joi.string().trim().required().messages({
    "string.empty": "Destination location is required.",
  }),

  midStops: Joi.array()
    .items(
      Joi.string().trim().optional().messages({
        "string.empty": "Mid stop location is required.",
      })
    )
    .optional(),

  seatsAvailable: Joi.number().integer().min(1).required().messages({
    "number.base": "Seats available must be a number.",
    "number.min": "Seats available must be at least 1.",
    "any.required": "Seats available is required.",
  }),

  price: Joi.object({
    amount: Joi.number().min(0).required().messages({
      "number.base": "Price amount must be a number.",
      "number.min": "Price amount cannot be negative.",
      "any.required": "Price amount is required.",
    }),
    currency: Joi.string().trim().required().messages({
      "string.empty": "Currency is required.",
    }),
  }).required(),
});

const validateCreateRide = validator(createRideSchema);
const validateResetPassword = validator(resetPasswordSchema);
const validateEmail = validator(emailSchema);
const validateSignin = validator(signInpSchema);
const validateSignup = validator(signUpSchema);
const validateOtp = validator(otpSchema);

export {
  validateCreateRide,
  validateResetPassword,
  validateEmail,
  validateSignup,
  validateOtp,
  validateSignin,
};
