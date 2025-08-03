import dotenv from "dotenv";
import { PaymentService } from "./paymentService";

dotenv.config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export const paymentService = new PaymentService(
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET
);
