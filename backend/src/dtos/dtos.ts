import { Doctor } from "../domain/entities/Doctor";
import { IUser } from "../domain/entities/User";
import { Slot } from "../domain/entities/Slot";
import { TimeSlot } from "../domain/entities/Slot";

export interface AppointmentInputDTO {
  doctorId: string;
  userId: string;
  date: any;
  slotId: string;
  timeSlotId: string;
  time: string;
  modeOfVisit: "Video" | "Clinic";
  amount: number;
  paymentId: string;
}

export interface AppointmentsByUserIdDTO {
  _id: string;
  doctorId: {
    _id: string;
    fullName: string;
  };
  userId: string;
  date: Date;
  slotId: {
    _id: string;
    doctorId: string;
    date: Date;
  };
  timeSlotId: string;
  time: string;
  isPaid?: boolean;
  isCancelled?: boolean;
  isCompleted?: boolean;
  isReviewed?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface AppointmentsByDocIdDTO {
  _id: string;
  doctorId: string;
  userId: {
    _id: string;
    fullName: string;
  };
  date: Date;
  slotId: Slot;
  timeSlotId: TimeSlot;
  time: string;
  modeOfVisit: "Video" | "Clinic";
  amount: number;
  paymentId: string;
  isPaid?: boolean;
  isCancelled?: boolean;
  refundAmount?: number;
  refundStatus?: "Pending" | "Processed" | "Failed";
  refundTransactionId?: string | null;
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

export interface AppointmentsByIdWithDocDetailsDTO {
  _id: string;
  doctorId: {
    _id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    registerNumber: string;
  };
  userId: string;
  date: Date;
  slotId: string;
  timeSlotId: string;
  time: string;
  isCancelled?: boolean;
  isCompleted?: boolean;
  rating?: number;
  reviewMessage?: string;
  isReviewed?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}
