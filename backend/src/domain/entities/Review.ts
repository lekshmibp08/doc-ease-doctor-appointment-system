import { Types } from "mongoose";

export interface IReview {
  userId: Types.ObjectId
  doctorId: Types.ObjectId
  appointmentId: Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
}