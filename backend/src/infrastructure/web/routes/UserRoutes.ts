import express from "express";
import { userController } from "../controllers/UserController";

const router = express.Router();

// Send OTP during signup
router.post("/send-otp", userController.register);

// Verify OTP and register user
router.post("/verify-otp-and-register", userController.verifyOtpAndRegisterUser);

export default router;
