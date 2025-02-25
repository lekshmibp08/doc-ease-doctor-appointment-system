import express from "express";
import { authController } from "../controllers/AuthController";

const router = express.Router();


// Logout route
router.post("/google", authController.googleLogin);

export default router;
