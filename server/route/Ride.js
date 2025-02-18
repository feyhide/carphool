import express from "express";
import { verifyToken } from "../utils/verifytoken.js";
import { createRide, getRides } from "../controller/Ride.js";

const router = express.Router();

router.post("/create-ride", verifyToken, createRide);
router.post("/get-rides", verifyToken, getRides);

export default router;
