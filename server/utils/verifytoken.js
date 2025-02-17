import jwt from "jsonwebtoken";
import { sendError } from "./response.js";
import User from "../model/User.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(
      sendError(res, "Unauthorized, Login to access this feature", null, 401)
    );
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(sendError(res, "Forbidden", null, 403));
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(sendError(res, "User not found", null, 404));
      }

      if (user.tokenVersion !== decoded.token_version) {
        return next(
          sendError(res, "Token expired, please login again", null, 401)
        );
      }

      req.user = user;
      next();
    } catch (error) {
      return next(sendError(res, "Error verifying token", error.message, 500));
    }
  });
};

export const verifyAdmin = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(
      sendError(res, "Unauthorized, Login to access this feature", null, 401)
    );
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(sendError(res, "Forbidden", null, 403));
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(sendError(res, "User not found", null, 404));
      }

      if (user.tokenVersion !== decoded.token_version) {
        return next(
          sendError(res, "Token expired, please login again", null, 401)
        );
      }

      if (user.accountType !== "admin") {
        return next(sendError(res, "Access not allowed", null, 401));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(sendError(res, "Error verifying token", error.message, 500));
    }
  });
};
