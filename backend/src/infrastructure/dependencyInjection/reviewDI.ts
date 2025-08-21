import { ReviewRepository } from "../database/repositories/reviewRepository";
import { AppointmentRepository } from "../database/repositories/appoinmentRepository";
import { ReviewUseCase } from "../../application/useCases/implimentations/reviewUseCase";
import { ReviewController } from "../../interfaces/controllers/reviewController";

export function createReviewController() {
  const reviewRepository = new ReviewRepository();
  const appointmentRepository = new AppointmentRepository();

  const reviewUseCase = new ReviewUseCase(reviewRepository);

  return new ReviewController(reviewUseCase, appointmentRepository);
}
