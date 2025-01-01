import { Request, Response, RequestHandler } from "express";
import { paymentService } from "../services/paymentService";

export const paymentController = {
  createOrder: (async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount } = req.body; // Amount in rupees
      if (!amount) {
        res.status(400).json({ message: "Amount is required" });
        return;
      }

      const order = await paymentService.createOrder(amount);
      res.status(200).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  }) as RequestHandler, // Explicitly type as RequestHandler
};
