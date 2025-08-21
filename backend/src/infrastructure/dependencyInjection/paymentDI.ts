import { CreateOrderUseCase } from "../../application/useCases/implimentations/createOrderUseCase "; 
import { paymentService } from "../../infrastructure/services";
import { PaymentController } from "../../interfaces/controllers/paymentController";

export function createPaymentController() {
  const createOrderUseCase = new CreateOrderUseCase(paymentService);
  return new PaymentController(createOrderUseCase);
}
