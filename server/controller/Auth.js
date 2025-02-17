import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { redisClient } from "../server.js";
import User from "../model/User.js";
import dotenv from "dotenv";
import {
  validateEmail,
  validateOtp,
  validateResetPassword,
  validateSignin,
  validateSignup,
} from "../utils/validator.js";
import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../utils/response.js";
import { client } from "../utils/constant.js";

dotenv.config();

export const sendUserInfo = async (user) => {
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

export const generateTokens = async (user) => {
  let decoded;
  const accessToken = jwt.sign(
    { id: user._id, token_version: user.tokenVersion },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id, token_version: user.tokenVersion },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const signup = async (req, res) => {
  const { email, password, username, fullname } = req.body;
  const { error, value } = validateSignup(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return sendValidationError(res, errorMessages, null, 400);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use." });

    const hashedPassword = bcryptjs.hashSync(password, 8);

    const otp = generateOTP();
    const otpKey = `otp:${email}`;
    const tempUserKey = `temp_user:${email}`;

    const pipeline = redisClient.pipeline();
    pipeline.del(otpKey);
    pipeline.del(tempUserKey);
    pipeline.setex(otpKey, 60, otp);
    pipeline.setex(
      tempUserKey,
      600,
      JSON.stringify({ fullname, username, email, hashedPassword })
    );
    await pipeline.exec();

    await transporter.sendMail({
      to: email,
      subject: "OTP for Account Verification",
      text: `Your OTP is ${otp}. It expires in 1 minute.`,
    });

    return sendSuccess(
      res,
      `OTP sent to ${email}. Please verify within 1 minute.`,
      null,
      200
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return sendError(res, "Signup failed. Try again later", null, 500);
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const { error, value } = validateOtp(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return sendValidationError(res, errorMessages, null, 400);
  }

  try {
    const otpKey = `otp:${email}`;
    const tempUserKey = `temp_user:${email}`;

    const [storedOtp, tempUserData] = await redisClient.mget(
      otpKey,
      tempUserKey
    );

    if (!storedOtp || !tempUserData) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (storedOtp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const {
      fullname,
      username,
      email: userEmail,
      hashedPassword,
    } = JSON.parse(tempUserData);

    const newUser = new User({
      fullname,
      username,
      email: userEmail,
      password: hashedPassword,
    });
    await newUser.save();

    await redisClient.del(otpKey);
    await redisClient.del(tempUserKey);

    const { accessToken, refreshToken } = await generateTokens(newUser);
    newUser.accessToken = accessToken;
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

    return sendSuccess(
      res,
      "User registered successfully!",
      await sendUserInfo(newUser),
      200
    );
  } catch (error) {
    console.error("OTP Verification Error:", error);
    if (error.code === 11000) {
      return sendError(res, "Username is taken.", null, 500);
    }
    return sendError(
      res,
      "An error occurred during OTP verification.",
      null,
      500
    );
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const { error, value } = validateSignin(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return sendValidationError(res, errorMessages, null, 400);
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser)
      return res.status(404).json({ message: "Invalid credentials" });

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = await generateTokens(validUser);
    validUser.accessToken = accessToken;
    validUser.refreshToken = refreshToken;
    await validUser.save();

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

    return sendSuccess(
      res,
      "Logged in successfully.",
      await sendUserInfo(validUser),
      200
    );
  } catch (error) {
    return sendError(res, "Sign in failed. Try again later", null, 500);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return sendSuccess(res, "Logged out successfully.", null, 200);
  } catch (error) {
    return sendError(res, "Sign out failed. Try again later", null, 500);
  }
};

export const resetLink = async (req, res) => {
  const { email } = req.body;

  const { error, value } = validateEmail(email);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return sendValidationError(res, errorMessages, null, 400);
  }

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const resetToken = jwt.sign(
        { id: user._id, token_version: user.tokenVersion },
        process.env.JWT_RESET_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const resetUrl = `${client}/reset-password/${resetToken}`;

      await transporter.sendMail({
        to: user.email,
        subject: "OTP for Changing Password",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      });

      return sendSuccess(res, `reset link sent to ${user.email}.`, null, 200);
    } else {
      return sendError(res, "User not found.", null, 404);
    }
  } catch (error) {
    console.error("Error sending otp:", error);
    return sendError(res, "Error sending otp.", error.message, 500);
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const { error, value } = validateResetPassword(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return sendValidationError(res, errorMessages, null, 400);
  }

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return sendError(
          res,
          "Link has expired. Request a new one.",
          null,
          401
        );
      } else if (error.name === "JsonWebTokenError") {
        return sendError(res, "Invalid Link.", null, 401);
      } else {
        return sendError(res, "Link verification failed.", error.message, 401);
      }
    }

    const user = await User.findById(decoded.id);

    if (user && user.tokenVersion === decoded.token_version) {
      const hashedPassword = bcryptjs.hashSync(newPassword, 10);

      user.password = hashedPassword;
      user.tokenVersion += 1;

      await user.save();

      const { accessToken, refreshToken } = await generateTokens(user);
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();

      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

      return sendSuccess(
        res,
        "Password reset successfully.",
        await sendUserInfo(user),
        200
      );
    } else {
      return sendError(res, "User not found or Token expired.", null, 404);
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return sendError(
      res,
      "Resetting Password Failed. Try again later",
      error.message,
      500
    );
  }
};

export const refreshMyToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refresh_token || req.body.refresh_token;

    if (!incomingRefreshToken) {
      return sendError(res, "Unauthorized Access", null, 401);
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decodedToken?.id).select("-password");

    if (!user) {
      return sendError(res, "Invalid Refresh Token", null, 401);
    }

    if (
      incomingRefreshToken !== user.refreshToken ||
      decodedToken.token_version !== user.tokenVersion
    ) {
      return sendError(
        res,
        "Refresh Token is either expired or used",
        null,
        401
      );
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

    return sendSuccess(
      res,
      "Refreshed token successfully.",
      await sendUserInfo(user),
      200
    );
  } catch (error) {
    console.error("Error refreshing token:", error);
    return sendError(
      res,
      "Refreshing Token Failed. Try again later",
      error,
      500
    );
  }
};
