import mongoose, { Schema, type Document } from "mongoose"

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  doctorId: mongoose.Types.ObjectId
  appointmentId: mongoose.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
}