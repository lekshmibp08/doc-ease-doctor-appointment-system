import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import morgan from "morgan";

import connectDB from "./infrastructure/database/connection";
import userRoutes from "./interfaces/routes/userRoutes";
import doctorRoutes from "./interfaces/routes/doctorRoutes";
import adminRoutes from "./interfaces/routes/adminRoutes";
import authRoutes from "./interfaces/routes/authRoutes";
import {
  notFound,
  errorHandler,
} from "./interfaces/middlewares/errorMiddleWare ";
import { initializeSocket } from "./infrastructure/socket";

dotenv.config({ path: `${__dirname}/../.env` });

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const FRONT_END_URL = process.env.FRONT_END_URL;

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: FRONT_END_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

// Database connection
connectDB();

// Initialize Socket.IO
initializeSocket(server); 

// Start server
server.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
