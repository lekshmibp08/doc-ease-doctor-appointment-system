import express from "express";
import { doctorController } from "../controllers/DoctorController";
import { authController } from "../controllers/AuthController";
import { slotController } from "../controllers/SlotController";
import { authenticateUser } from "../../middlewares/AuthMiddleware";
import { appoinmentController } from "../controllers/AppoinmentController";
import { chatController } from "../controllers/ChatController";

const router = express.Router();

// Send OTP during signup
router.post("/send-otp", doctorController.register);

// Verify OTP and register user
router.post("/verify-otp-and-register", doctorController.verifyOtpAndRegisterUser);

// Login route
router.post("/login", doctorController.login);

// Refresh token endpoint
router.post("/refresh-token", authController.refreshAccessToken);

//send OTP for forget password
router.post("/forget-password/send-otp", doctorController.sendOtpForForgetPassword);

//verify OTP and reset password
router.patch("/forget-password/verify-and-reset", doctorController.verifyAndResetPassword);

// Logout route
router.post("/logout", authController.logout);

// update user profile
router.patch("/profile/update/:id", authenticateUser(['doctor']), doctorController.updateDoctorProfile);

// Get slots for Doctor
//router.get("/slots", authenticateUser(['doctor']), slotController.fetchOrCreateSlot);
router.get("/slots", authenticateUser(['doctor']), slotController.fetchSlot);

router.post("/generate-slots", authenticateUser(['doctor']), slotController.generateSlots);

// Get all appointments for the doctor
router.get("/appointments", authenticateUser(['doctor']), appoinmentController.getAppointmentsByDoctorId);

// Slot management by doctor
router.put("/slots/update-status", authenticateUser(['doctor']), slotController.updateSlotStatus);

router.put("/slots/update-time", authenticateUser(['doctor']), slotController.updateSlotTime);

router.get("/get-chats", authenticateUser(['doctor']), chatController.getAllChatsForDoctor);

router.get("/get-messages", authenticateUser(['doctor']), chatController.getAChatUsingChatId);

router.post("/send-message", authenticateUser(['doctor']), chatController.sendMessage);






export default router;
