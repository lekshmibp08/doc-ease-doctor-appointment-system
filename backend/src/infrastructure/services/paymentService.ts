import Razorpay from "razorpay";

export class PaymentService {
  private razorpay: Razorpay;

  constructor(keyId: string, keySecret: string) {
    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are missing");
    }
    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  async createOrder(amount: number) {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    return await this.razorpay.orders.create(options);
  }

  async processRefund(paymentId: string, refundAmount: number) {
    return await this.razorpay.payments.refund(paymentId, {
      amount: refundAmount * 100,
      speed: "normal",
    });
  }
}
