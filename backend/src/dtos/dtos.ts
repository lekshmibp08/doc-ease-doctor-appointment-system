import { Doctor } from "../domain/entities/doctor";
import { IUser } from "../domain/entities/user";
import { Slot } from "../domain/entities/slot";
import { TimeSlot } from "../domain/entities/slot";

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
    age: string;
  };
  date: Date;  
  time: string;
  modeOfVisit: "Video" | "Clinic";  
  isCancelled?: boolean;
  isCompleted?: boolean;  
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

export interface AllAppointmentsByAdminDTO {
  _id: string;
  user: {
    fullName: string;
  };
  doctor: {
    fullName: string
  };
  date: string;
  time: string;
  isCompleted: boolean;
}
