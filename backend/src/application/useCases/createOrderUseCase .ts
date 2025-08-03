import { PaymentService } from "../../infrastructure/services/paymentService";


export class CreateOrderUseCase {
  constructor(private paymentService: PaymentService) {}

  async execute(amount: number) {
    return this.paymentService.createOrder(amount);
  }
}
