import express from "express";
import { userController } from "../controllers/UserController"; 
import { authController } from "../controllers/AuthController";
import { authenticateUser } from "../middlewares/AuthMiddleware";
import { slotController } from "../controllers/SlotController";
import { paymentController } from "../controllers/PaymentController";
import { appoinmentController } from "../controllers/AppoinmentController";
import { chatController } from "../controllers/ChatController";
import { prescriptionController } from "../controllers/PrescriptionController";
import { reviewController } from "../controllers/reviewController";


const router = express.Router();

// Send OTP during signup
//router.post("/send-otp", userController.register);

// Verify OTP and register user
//router.post("/verify-otp-and-register", userController.verifyOtpAndRegisterUser);

// Login route
router.post("/login", userController.login);

// Refresh token endpoint
router.post("/refresh-token", authController.refreshAccessToken);

// Logout route
router.post("/logout", authController.logout);

// Get all Approved doctors
router.get("/doctors", authenticateUser(['user']), userController.getDoctors);

// List all Specializations
router.get("/doctors/specializations", userController.listSpecializations);

// update user profile
//router.patch("/profile/update/:id", authenticateUser(['user']), userController.updateUserProfile);

//send OTP for forget password
//router.post("/forget-password/send-otp", userController.sendOtpForForgetPassword);

//verify OTP and reset password
//router.patch("/forget-password/verify-and-reset", userController.verifyAndResetPassword);

// Get doctor details
//router.get("/doctor/:id", authenticateUser(['user']), userController.getDoctorDetails);

// Get slots
router.get("/slots/:doctorId", authenticateUser(['user']), slotController.fetchSlotsForUser);

router.post("/create-order", authenticateUser(['user']), paymentController.createOrder);

router.post("/book-appointment", authenticateUser(['user']), appoinmentController.createNewAppoinment);

router.get("/appointments/:userId", authenticateUser(['user']), appoinmentController.getAppointmentsByUser);

router.put("/appointments/:appointmentId", authenticateUser(['user']), appoinmentController.cancelAppointmentByUser);

router.put("/reschedule-appointment", authenticateUser(['user']), appoinmentController.rescheduleAppointmentByUser);

router.get('/prescriptions/:appointmentId', authenticateUser(['user']), prescriptionController.getPrescriptionForUser)

router.post("/chat", authenticateUser(['user']), chatController.getOrCreateChat);

router.get("/get-chats", authenticateUser(['user']), chatController.getAllChats);

router.post("/send-message", authenticateUser(['user']), chatController.sendMessage);

router.get("/get-messages", authenticateUser(['user']), chatController.getAChatUsingChatId);

router.post("/reviews", reviewController.createReview)

router.get("/reviews/:doctorId", reviewController.getReviewsByDoctorId)

router.get("/reviews", reviewController.getReviewsByAppointmentId)

router.put("/reviews/:reviewId", reviewController.updateReview)


export default router;
