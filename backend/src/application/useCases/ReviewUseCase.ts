import { IReviewRepository } from "../../domain/repositories/IReviewRepository"
import { IReview } from "../../domain/entities/Review"

export class ReviewUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  async createReview(reviewData: Partial<IReview>): Promise<IReview> {
    return await this.reviewRepository.createReview(reviewData)
  }

  async getReviewsByAppointmentId(appointmentId: string): Promise<IReview[]> {
    return await this.reviewRepository.getReviewsByAppointmentId(appointmentId)
  }

  async updateReview(id: string, updateData: Partial<IReview>) {
    return await this.reviewRepository.findByIdAndUpdate(id, updateData);
  }

  async getReviewsByDoctorId(doctorId: string): Promise<IReview[]> {
    return await this.reviewRepository.getReviewsByDoctorId(doctorId)
  }
}

