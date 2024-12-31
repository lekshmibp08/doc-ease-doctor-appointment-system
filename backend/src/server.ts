import express from "express";
import dotenv from "dotenv";
import cors from 'cors';

import connectDB from "./infrastructure/database/connection";
import userRoutes from "./infrastructure/web/routes/UserRoutes";
import doctorRoutes from "./infrastructure/web/routes/DoctorRoutes"
import adminRoutes from "./infrastructure/web/routes/AdminRoutes"
import authRoutes from "./infrastructure/web/routes/AuthRoutes"
import { setupSlotMaintenanceJob } from "./infrastructure/jobs/slotJob";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());


// Routes
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);


connectDB();
setupSlotMaintenanceJob();


app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
