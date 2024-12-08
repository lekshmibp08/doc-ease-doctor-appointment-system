import express from "express";
import { adminController } from "../controllers/AdminController";

const router = express.Router();


// Login route
router.post("/login", adminController.login);

export default router;
