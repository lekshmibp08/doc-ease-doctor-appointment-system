import mongoose, { Schema, Document } from "mongoose";
import { Doctor } from "../../../domain/entities/Doctor";

interface IDoctorDocument extends Document, Doctor {
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
    isBlocked: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctorDocument>("Doctor", DoctorSchema);
