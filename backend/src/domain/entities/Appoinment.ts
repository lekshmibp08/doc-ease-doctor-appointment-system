import { Document, Types } from "mongoose";

export type IAppointment = {
  _id?: Types.ObjectId | string;
  doctorId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  date: Date;
  slotId: Types.ObjectId | string;
  timeSlotId: Types.ObjectId | string;
  time: string;
  modeOfVisit: "Video" | "Clinic";
  amount: number;
  paymentId: string;
  isPaid?: boolean;
  isCancelled?: boolean;
  refundAmount?: number;
  videoCallEnabled?: boolean;
  chatEnabled?: boolean;
  isCompleted?: boolean;
  rating?: number; 
  reviewMessage?: string; 
  videoCallId?: string; 
  isReviewed?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}
