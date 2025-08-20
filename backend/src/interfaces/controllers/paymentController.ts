import { Request, Response, RequestHandler, NextFunction } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { CreateOrderUseCase } from "../../application/useCases/implimentations/createOrderUseCase "; 
import { paymentService } from "../../infrastructure/services";

const createOrderUseCase = new CreateOrderUseCase(paymentService);

export const paymentController = {
  createOrder: (async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { amount } = req.body; 
      if (!amount) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Amount is required" });
        return;
      }

      const order = await createOrderUseCase.execute(amount);
      res.status(HttpStatusCode.OK).json(order);
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,
};
