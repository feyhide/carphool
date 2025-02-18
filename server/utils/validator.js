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

const createRideSchema = Joi.object({
  vehicle: Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Vehicle is required.",
    }),
    type: Joi.string().trim().required().messages({
      "string.empty": "Vehicle Type is required.",
    }),
  }).required(),

  description: Joi.string().trim().optional().messages({
    "string.empty": "Description is required.",
  }),

  pickUpPoint: Joi.object({
    location: Joi.string().trim().required().messages({
      "string.empty": "Pickup point location is required.",
    }),
    departureTime: Joi.date().iso().required().messages({
      "date.base": "Pickup point departure time must be a valid date.",
      "any.required": "Pickup point departure time is required.",
    }),
    description: Joi.string().trim().allow("").optional(),
  }).required(),

  destinationPoint: Joi.object({
    location: Joi.string().trim().required().messages({
      "string.empty": "Destination point location is required.",
    }),
    description: Joi.string().trim().allow("").optional(),
  }).required(),

  midStops: Joi.array()
    .items(
      Joi.object({
        location: Joi.string().trim().required().messages({
          "string.empty": "Mid stop location is required.",
        }),
        description: Joi.string().trim().allow("").optional(),
      })
    )
    .optional(),

  seatsAvailable: Joi.number().integer().min(1).required().messages({
    "number.base": "Seats available must be a number.",
    "number.min": "At least 1 seat must be available.",
    "any.required": "Seats available is required.",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price is required.",
  }),
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
