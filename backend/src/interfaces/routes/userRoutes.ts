import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { paymentController } from "../controllers/paymentController";
import { 
    createAppointmentController,
    createAuthController, 
    createChatController, 
    createPrescriptionController,
    createReviewController,
    createSlotController,
    createUserController
} from "../../infrastructure/dependencyInjection";


const router = express.Router();

const authController = createAuthController();
const chatController = createChatController();
const prescriptionController = createPrescriptionController();
const reviewController = createReviewController();
const slotController = createSlotController();
const userController = createUserController();
const appoinmentController = createAppointmentController();


router.post("/send-otp", userController.register);

router.post("/verify-otp-and-register", userController.verifyOtpAndRegisterUser);

router.post("/login", userController.login);

router.post("/refresh-token", authController.refreshAccessToken);

router.post("/logout", authController.logout);

router.get("/doctors", authenticateUser(['user']), userController.getDoctors);

router.get("/doctors/specializations", userController.listSpecializations);

router.patch("/profile/update/:id", authenticateUser(['user']), userController.updateUserProfile);

router.post("/forget-password/send-otp", userController.sendOtpForForgetPassword);

router.patch("/forget-password/verify-and-reset", userController.verifyAndResetPassword);

router.get("/doctor/:id", authenticateUser(['user']), userController.getDoctorDetails);

router.get("/slots/:doctorId", authenticateUser(['user']), slotController.fetchSlotsForUser);

router.post("/create-order", authenticateUser(['user']), paymentController.createOrder);

router.post("/book-appointment", authenticateUser(['user']), appoinmentController.createNewAppointment);

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
