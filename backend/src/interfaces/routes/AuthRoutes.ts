import express from "express";
import { authController } from "../controllers/AuthController"; 

const router = express.Router();


router.post("/google", authController.googleLogin);

export default router;
