import express from "express";
import { createAuthController } from "../../infrastructure/dependencyInjection";

const router = express.Router();

const authController = createAuthController();


router.post("/google", authController.googleLogin);

export default router;
