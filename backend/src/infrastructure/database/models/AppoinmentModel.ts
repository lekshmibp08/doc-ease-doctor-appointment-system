import mongoose, { Model, Document, Types } from "mongoose";
import { IAppointment } from "../../../domain/entities/appoinment";

export interface IAppointmentDocument extends Document {
  _id: Types.ObjectId;
  doctorId: Types.ObjectId;
  userId: Types.ObjectId;
  date: Date;
  slotId: Types.ObjectId;
  timeSlotId: Types.ObjectId;
  time: string;
  modeOfVisit: "Video" | "Clinic";
  amount: number;
  paymentId: string;
  isPaid: boolean;
  isCancelled: boolean;
  refundAmount: number;
  refundStatus: "Pending" | "Processed" | "Failed";
  refundTransactionId: string | null;
  videoCallEnabled: boolean;
  chatEnabled: boolean;
  isCompleted: boolean;
  rating?: number;
  reviewMessage?: string;
  videoCallId?: string;
  isReviewed: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}

const appointmentSchema = new mongoose.Schema<IAppointmentDocument>({
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Doctor", 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    slotId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Slot", 
        required: true 
    },
    timeSlotId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    modeOfVisit: { 
        type: String, 
        enum: ["Video", "Clinic"], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    paymentId: { 
        type: String, 
        required: true 
    },
    isPaid: { 
        type: Boolean, 
        default: true 
    },
    isCancelled: { 
        type: Boolean, 
        default: false 
    },
    refundAmount: { 
        type: Number, 
        default: 0 
    },
    refundStatus: {
      type: String,
      enum: ["Pending", "Processed", "Failed"],
      default: "Pending", 
    },
    refundTransactionId: {
      type: String,
      default: null, 
    },
    videoCallEnabled: { 
        type: Boolean, 
        default: false 
    },
    chatEnabled: { 
        type: Boolean, 
        default: false 
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
    videoCallId: { 
        type: String 
    },
    isReviewed: {
        type: Boolean,
        default: false
    }
},  
{ 
    timestamps: true 
});

const AppointmentModel: Model<IAppointmentDocument> = mongoose.model<IAppointmentDocument>("Appointment", appointmentSchema);
export default AppointmentModel;
