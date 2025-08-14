import { HttpStatusCode } from "../../../enums/HttpStatusCode"; 
import { PaymentService } from "../../../infrastructure/services/paymentService"; 
import { AppError } from "../../../shared/errors/appError"; 

export class CreateOrderUseCase {
  constructor(private paymentService: PaymentService) {}

  async execute(amount: number) {
    try {
      return this.paymentService.createOrder(amount);
    } catch (error: any) {
      throw new AppError(
        error.message || "Error creating order",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
