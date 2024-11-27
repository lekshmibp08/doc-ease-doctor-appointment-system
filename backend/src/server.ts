import express from "express";
import dotenv from "dotenv";
import connectDB from "./infrastructure/database/connection";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
//app.use("/api/v1", require("./infrastructure/routes"));
app.get('/', (req, res) => {
  res.send('API is running...');
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
