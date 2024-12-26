import express from "express";
import { userController } from "../controllers/UserController";
import { authController } from "../controllers/AuthController";
import { authenticateUser } from "../../middlewares/AuthMiddleware";

const router = express.Router();

// Send OTP during signup
router.post("/send-otp", userController.register);

// Verify OTP and register user
router.post("/verify-otp-and-register", userController.verifyOtpAndRegisterUser);

// Login route
router.post("/login", userController.login);

// Logout route
router.post("/logout", authController.logout);

// Get all Approved doctors
router.get("/doctors", userController.getDoctors);

// update user profile
router.patch("/profile/update/:id", userController.updateUserProfile);

//send OTP for forget password
router.post("/forget-password/send-otp", userController.sendOtpForForgetPassword);

//verify OTP and reset password
router.patch("/forget-password/verify-and-reset", userController.verifyAndResetPassword);



export default router;
