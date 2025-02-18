import express from "express";
import { verifyToken } from "../utils/verifytoken.js";
import { setCurrency } from "../controller/User.js";

const router = express.Router();

router.post("/set-currency", verifyToken, setCurrency);

export default router;
