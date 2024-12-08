import express from "express";
import { doctorController } from "../controllers/DoctorController";
const router = express.Router();

// Send OTP during signup
router.post("/send-otp", doctorController.register);

// Verify OTP and register user
router.post("/verify-otp-and-register", doctorController.verifyOtpAndRegisterUser);

// Login route
router.post("/login", doctorController.login);

export default router;
