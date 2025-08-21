import type { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { ReviewUseCase } from "../../application/useCases/implimentations/reviewUseCase";
import { AppointmentRepository } from "../../infrastructure/database/repositories/appoinmentRepository";
import { updateAppointmentReviewStatus } from "../../application/useCases/implimentations/user/updateAppointmentReviewStatus";

export class ReviewController {
  constructor(
    private reviewUseCase: ReviewUseCase,
    private appointmentRepository: AppointmentRepository
  ) {}

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, doctorId, appointmentId, rating, comment } = req.body;

      const review = await this.reviewUseCase.createReview({
        userId,
        doctorId,
        appointmentId,
        rating,
        comment,
      });

      const isReviewed = true;
      const result = await updateAppointmentReviewStatus(
        appointmentId,
        this.appointmentRepository,
        isReviewed
      );

      res.status(HttpStatusCode.CREATED).json({ success: true, review, result });
    } catch (error) {
      next(error);
    }
  };

  getReviewsByAppointmentId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointmentId = req.query.appointmentId as string;
      const review = await this.reviewUseCase.getReviewsByAppointmentId(appointmentId);
      res.status(HttpStatusCode.OK).json({ success: true, review });
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId } = req.params;
      const updateData = req.body;

      await this.reviewUseCase.updateReview(reviewId, updateData);

      res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  getReviewsByDoctorId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { doctorId } = req.params;
      const reviews = await this.reviewUseCase.getReviewsByDoctorId(doctorId);

      res.status(HttpStatusCode.OK).json({ success: true, reviews });
    } catch (error) {
      next(error);
    }
  };
}
