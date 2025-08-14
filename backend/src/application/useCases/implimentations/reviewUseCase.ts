import { IReviewUseCase } from "../interfaces/IReviewUseCase"
import { IReviewRepository } from "../../../domain/repositories/IReviewRepository" 
import { IReview } from "../../../domain/entities/review" 
import { ReviewsByDoctorIdDTO } from "../../../dtos/reviewDTO/reviewDTOS" 
import { mapToReviewsByAppointmentIdDTO } from "../../../infrastructure/database/mappers/reviewMapper" 
import { ReviewsByAppointmentIdDTO } from "../../../dtos/reviewDTO/reviewDTOS" 

export class ReviewUseCase implements IReviewUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  async createReview(reviewData: Partial<IReview>): Promise<Partial<IReview>> {
    const result = await this.reviewRepository.createReview(reviewData);
    return mapToReviewsByAppointmentIdDTO(result);
  }

  async getReviewsByAppointmentId(appointmentId: string): Promise<ReviewsByAppointmentIdDTO[]> {
    const result = await this.reviewRepository.getReviewsByAppointmentId(appointmentId);
    return result.map(mapToReviewsByAppointmentIdDTO)
  }

  async updateReview(id: string, updateData: Partial<IReview>) {
    return await this.reviewRepository.findByIdAndUpdate(id, updateData);
  }

  async getReviewsByDoctorId(doctorId: string): Promise<ReviewsByDoctorIdDTO[]> {
    const reviews = await this.reviewRepository.getReviewsByDoctorId(doctorId);

  return reviews.map((review): any => ({
    userId: review.userId,
    rating: review.rating,
    comment: review.comment,
  }));
  }
}

