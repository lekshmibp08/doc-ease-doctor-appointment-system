import express from "express";
import dotenv from "dotenv";
import cors from 'cors';

import connectDB from "./infrastructure/database/connection";
import userRoutes from "./infrastructure/web/routes/UserRoutes";
import doctorRoutes from "./infrastructure/web/routes/doctorRoutes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);


connectDB();

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
