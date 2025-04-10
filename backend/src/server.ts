import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";
import http from 'http';
import morgan from 'morgan'

import connectDB from "./infrastructure/database/connection";
import userRoutes from "./infrastructure/web/routes/UserRoutes";
import doctorRoutes from "./infrastructure/web/routes/doctorRoutes"
import adminRoutes from "./infrastructure/web/routes/AdminRoutes"
import authRoutes from "./infrastructure/web/routes/AuthRoutes"
import { notFound, errorHandler } from "./infrastructure/middlewares/ErrorMiddleWare "
//import { setupSlotMaintenanceJob } from "./infrastructure/jobs/slotJob";
import { initializeSocket } from "./infrastructure/web/socket";

dotenv.config({ path: `${__dirname}/../.env` });

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const FRONT_END_URL = process.env.FRONT_END_URL;

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: FRONT_END_URL, 
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));


// Routes
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound); // 404 Handler
app.use(errorHandler); // Global Error Handler

// Database connection
connectDB();


// Initialize Socket.IO
initializeSocket(server); // Pass the HTTP server to Socket.IO initialization

// Start server
server.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});