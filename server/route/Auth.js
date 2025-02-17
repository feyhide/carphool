import express from "express";
import {
  refreshMyToken,
  resetLink,
  resetPassword,
  signin,
  signout,
  signup,
  verifyOTP,
} from "../controller/Auth.js";
import { verifyToken } from "../utils/verifytoken.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/verify-otp", verifyOTP);
router.get("/sign-out", verifyToken, signout);
router.get("/refresh-token", refreshMyToken);
router.post("/reset-link", resetLink);
router.post("/reset-password", resetPassword);

export default router;
