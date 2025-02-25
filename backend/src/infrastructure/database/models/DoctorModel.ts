import mongoose, { Schema, Document } from "mongoose";
import { Doctor } from "../../../domain/entities/Doctor";

interface IDoctorDocument extends Document, Doctor {
  _id: mongoose.Types.ObjectId;
  profilePicture: string;
  specialization: string;
  qualification: string;
  fee: number;
  gender: string;
  experience: number;
  modesOfConsultation: string[];
  gallery: string[];
  documents: string[],
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  } | null; 
  locationName: string 
  addressLine: string;
  isRejected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctorDocument>(
  {
    fullName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    mobileNumber: { 
      type: String, 
    },
    password: { 
      type: String, 
    },
    role: { 
      type: String, 
      enum: ["doctor"], 
      default: "doctor", 
      required: true 
    },
    registerNumber: { 
      type: String, 
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: 'https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png',
    },
    specialization: {
      type: String,
      default: "",
    },
    qualification: {
      type: String,
      default: "",
    },
    fee: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      default: "",
    },
    experience: {
      type: Number,
      default: 0,
    },
    modesOfConsultation: {
      type: [String],
      enum: ["Video", "Clinic"],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
    documents: {
      type: [String],
      default: [],
    },
    addressLine: {
      type: String,
      default: "",
    },
    locationCoordinates: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    locationName: {
      type: String,
      default: "",
    },

  },
  {
    timestamps: true,
  }
);


export default mongoose.model<IDoctorDocument>("Doctor", DoctorSchema);
