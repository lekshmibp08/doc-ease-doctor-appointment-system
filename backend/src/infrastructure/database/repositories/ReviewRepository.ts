import { IReview } from "../../../domain/entities/Review" 
import ReviewModel from "../models/ReviewModel"
import { IReviewRepository } from "../../../domain/repositories/IReviewRepository"

export class ReviewRepository implements IReviewRepository {
  async createReview(reviewData: Partial<IReview>): Promise<IReview> {
    const review = new ReviewModel(reviewData)
    return await review.save()
  }

  async getReviewsByAppointmentId(appointmentId: string): Promise<IReview[]> { 
    return await ReviewModel.find({ appointmentId })
  }

  async findByIdAndUpdate(id: string, updateData: Partial<IReview>) {
    return await ReviewModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getReviewsByDoctorId(doctorId: string): Promise<IReview[]> {
    return await ReviewModel.find({ doctorId }).populate("userId", "fullName")
  }
}
