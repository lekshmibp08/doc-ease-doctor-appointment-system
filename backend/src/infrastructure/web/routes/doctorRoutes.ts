import express from "express";
import { doctorController } from "../controllers/DoctorController";
import { authController } from "../controllers/AuthController";
import { authenticateUser } from "../../middlewares/AuthMiddleware";
const router = express.Router();

// Send OTP during signup
router.post("/send-otp", doctorController.register);

// Verify OTP and register user
router.post("/verify-otp-and-register", doctorController.verifyOtpAndRegisterUser);

// Login route
router.post("/login", doctorController.login);

//send OTP for forget password
router.post("/forget-password/send-otp", doctorController.sendOtpForForgetPassword);

//verify OTP and reset password
router.patch("/forget-password/verify-and-reset", doctorController.verifyAndResetPassword);

// Logout route
router.post("/logout", authController.logout);

// update user profile
router.patch("/profile/update/:id", authenticateUser(["doctor"]), doctorController.updateDoctorProfile);


export default router;
