import express from "express";
import { adminController } from "../controllers/AdminController";
import { authController } from "../controllers/AuthController";

const router = express.Router();


// Login route
router.post("/login", adminController.login);

// Logout route
router.post("/logout", authController.logout);

export default router;
