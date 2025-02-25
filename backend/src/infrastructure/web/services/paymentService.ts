import Razorpay from "razorpay";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const RAZORPAY_KEY_ID= process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID || '',
  key_secret: RAZORPAY_KEY_SECRET || '',
});

export const paymentService = {
  async createOrder(amount: number) {
    try {
      const options = {
        amount: amount * 100, 
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
      
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error: any) {
      throw new Error(error.message || "Error creating order");
    }
  },
};

export const processRefund = async (paymentId: string, refundAmount: number) => {
    try {
        const refundResponse = await razorpay.payments.refund(paymentId, {
            amount: refundAmount * 100, // Convert to paise
            speed: "normal",
        });
        return { success: true, refundResponse };
    } catch (error) {
        console.error("Razorpay Refund Error:", error);
        return { success: false, error };
    }
};
 
