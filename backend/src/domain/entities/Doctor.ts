import { Types } from "mongoose";

export type Doctor = {
  _id?: Types.ObjectId;
  fullName: string;
  email: string;
  mobileNumber: string;
  registerNumber: string;
  password: string;
  role: "doctor";
  isApproved: boolean;
  isBlocked: boolean;
};
