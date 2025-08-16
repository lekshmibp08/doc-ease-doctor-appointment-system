import mongoose, { Schema } from "mongoose"
import { IReview } from "../../../domain/entities/review"


const ReviewSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IReview>("Review", ReviewSchema)

