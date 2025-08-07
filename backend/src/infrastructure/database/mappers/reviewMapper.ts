import { ReviewsByAppointmentIdDTO } from "../../../dtos/reviewDTO/reviewDTOS";

export const mapToReviewsByAppointmentIdDTO = (doc: any): ReviewsByAppointmentIdDTO => ({
  _id: doc._id?.toString(),
  rating: doc.rating,
  comment: doc.comment,
});