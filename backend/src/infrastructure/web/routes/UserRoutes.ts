import express from "express";
import { userController } from "../controllers/UserController";
import { authController } from "../controllers/AuthController";

const router = express.Router();

// Send OTP during signup
router.post("/send-otp", userController.register);

// Verify OTP and register user
router.post("/verify-otp-and-register", userController.verifyOtpAndRegisterUser);

// Login route
router.post("/login", userController.login);

// Get all Approved doctors
router.get("/doctors", userController.getDoctors);

// Logout route
router.post("/logout", authController.logout);


export default router;
