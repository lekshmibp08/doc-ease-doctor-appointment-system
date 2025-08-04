import { Types } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: "user" | "doctor" | "admin";
  isBlocked: boolean;
  _id?: Types.ObjectId;
  profilePicture?: string;
}
