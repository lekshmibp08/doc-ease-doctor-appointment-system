import { IReview } from "../../../domain/entities/review"; 
import { ReviewsByAppointmentIdDTO, ReviewsByDoctorIdDTO } from "../../../dtos/reviewDTO/reviewDTOS"; 

export interface IReviewUseCase {
  createReview(reviewData: Partial<IReview>): Promise<Partial<IReview>>;
  getReviewsByAppointmentId(appointmentId: string): Promise<ReviewsByAppointmentIdDTO[]>;
  updateReview(id: string, updateData: Partial<IReview>): Promise<IReview | null>;
  getReviewsByDoctorId(doctorId: string): Promise<ReviewsByDoctorIdDTO[]>;
}
