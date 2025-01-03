import express from "express";
import { userController } from "../controllers/UserController";
import { authController } from "../controllers/AuthController";
import { authenticateUser } from "../../middlewares/AuthMiddleware";
import { slotController } from "../controllers/SlotController";
import { paymentController } from "../controllers/PaymentController";
import { appoinmentController } from "../controllers/AppoinmentController";


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

// Get doctor details
router.get("/doctor/:id", userController.getDoctorDetails);

// Get slots
router.get("/slots/:doctorId", slotController.fetchSlotsForUser);

router.post("/create-order", paymentController.createOrder);

router.post("/book-appointment", appoinmentController.createNewAppoinment);


export default router;
