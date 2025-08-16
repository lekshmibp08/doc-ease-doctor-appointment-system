import mongoose, { Schema } from "mongoose";
import { Doctor } from "../../../domain/entities/doctor";

const DoctorSchema = new Schema<Doctor>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["doctor"], default: "doctor", required: true },
    registerNumber: { type: String },
    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    profilePicture: {
      type: String,
      default:
        "https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png",
    },
    specialization: { type: String, default: "" },
    qualification: { type: String, default: "" },
    fee: { type: Number, default: 0 },
    gender: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    modesOfConsultation: {
      type: [String],
      enum: ["Video", "Clinic"],
      default: [],
    },
    gallery: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    addressLine: { type: String, default: "" },
    locationCoordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    locationName: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Doctor>("Doctor", DoctorSchema);
