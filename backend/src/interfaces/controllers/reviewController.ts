import type { Request, Response } from "express"
import { ReviewUseCase } from "../../application/useCases/ReviewUseCase" 
import { ReviewRepository } from "../../infrastructure/database/repositories/ReviewRepository" 
import { AppointmentRepository } from "../../infrastructure/database/repositories/AppoinmentRepository"
import { updateAppointmentReviewStatus } from "../../application/useCases/user/updateAppointmentReviewStatus"

const reviewRepository = new ReviewRepository()
const reviewUseCase = new ReviewUseCase(reviewRepository)
const appointmentRepository = new AppointmentRepository();

export const reviewController = {
  createReview: async (req: Request, res: Response) => {
    try {
      const { userId, doctorId, appointmentId, rating, comment } = req.body
      const review = await reviewUseCase.createReview({
        userId,
        doctorId,
        appointmentId,
        rating,
        comment,
      })
      const isReviewed = true;
      const result = await updateAppointmentReviewStatus(appointmentId, appointmentRepository, isReviewed);
      res.status(201).json({ success: true, review, result })
    } catch (error) {
      res.status(500).json({ success: false, message: "Error creating review", error })
    }
  },

  getReviewsByAppointmentId: async (req: Request, res: Response) => {
    try {
      const appointmentId = req.query.appointmentId;
      const review = await reviewUseCase.getReviewsByAppointmentId(appointmentId as string)
      res.status(200).json({ success: true, review })
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching reviews", error })
    }
  },

  updateReview: async (req: Request, res: Response) => {
    try {
      const { reviewId } = req.params
      const updateData = req.body
      await reviewUseCase.updateReview(reviewId, updateData);
      res.status(200).json({ success: true })            
    } catch (error) {
    res.status(500).json({ message: "Error updating review", error })
    }
  },

  getReviewsByDoctorId: async (req: Request, res: Response) => {
    try {
      const { doctorId } = req.params
     
      const reviews = await reviewUseCase.getReviewsByDoctorId(doctorId)
      res.status(200).json({ success: true, reviews })
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching reviews", error })
    }
  },
}

