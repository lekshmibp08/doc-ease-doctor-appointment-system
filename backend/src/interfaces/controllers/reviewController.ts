import type { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { ReviewUseCase } from "../../application/useCases/implimentations/reviewUseCase"; 
import { ReviewRepository } from "../../infrastructure/database/repositories/reviewRepository";
import { AppointmentRepository } from "../../infrastructure/database/repositories/appoinmentRepository";
import { updateAppointmentReviewStatus } from "../../application/useCases/implimentations/user/updateAppointmentReviewStatus";

const reviewRepository = new ReviewRepository();
const reviewUseCase = new ReviewUseCase(reviewRepository);
const appointmentRepository = new AppointmentRepository();

export const reviewController = {
  createReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, doctorId, appointmentId, rating, comment } = req.body;
      const review = await reviewUseCase.createReview({
        userId,
        doctorId,
        appointmentId,
        rating,
        comment,
      });
      const isReviewed = true;
      const result = await updateAppointmentReviewStatus(
        appointmentId,
        appointmentRepository,
        isReviewed
      );
      res.status(HttpStatusCode.CREATED).json({ success: true, review, result });
    } catch (error) {
      next(error);
    }
  },

  getReviewsByAppointmentId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointmentId = req.query.appointmentId;
      const review = await reviewUseCase.getReviewsByAppointmentId(
        appointmentId as string
      );
      res.status(HttpStatusCode.OK).json({ success: true, review });
    } catch (error) {
      next(error);
    }
  },

  updateReview: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reviewId } = req.params;
      const updateData = req.body;
      await reviewUseCase.updateReview(reviewId, updateData);
      res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  },

  getReviewsByDoctorId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { doctorId } = req.params;

      const reviews = await reviewUseCase.getReviewsByDoctorId(doctorId);
      res.status(HttpStatusCode.OK).json({ success: true, reviews });
    } catch (error) {
      next(error);
    }
  },
};
