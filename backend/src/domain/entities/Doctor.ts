import { Types } from "mongoose";

export interface Doctor {
  _id?: Types.ObjectId;
  fullName: string;
  email: string;
  profilePicture?: string;
  mobileNumber: string;
  registerNumber: string;
  password: string;
  role: "doctor";
  isApproved: boolean;
  isBlocked: boolean;
};
