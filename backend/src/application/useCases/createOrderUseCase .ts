import { PaymentService } from "../../infrastructure/services/paymentService";


export class CreateOrderUseCase {
  constructor(private paymentService: PaymentService) {}

  async execute(amount: number) {
    try {
      return this.paymentService.createOrder(amount);      
    } catch (error: any) {
      throw new Error(error.message || "Error creating order");
    }
  }
}
