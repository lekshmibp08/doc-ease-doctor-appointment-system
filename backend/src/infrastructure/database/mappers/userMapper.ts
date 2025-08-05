import { IUser } from "../../../domain/entities/User"; 
import { Document, Types } from "mongoose";

interface IUserDoc extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: string;
  isBlocked: boolean;
  profilePicture?: string;
  gender?: string;
  age?: string;
  addressline?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export const mapToUserEntity = (doc: IUserDoc): IUser => {
  return {
    _id: doc._id.toString(),
    fullName: doc.fullName,
    email: doc.email,
    mobileNumber: doc.mobileNumber,
    password: doc.password,
    role: doc.role as "user" | "doctor" | "admin",
    isBlocked: doc.isBlocked,
    profilePicture: doc.profilePicture,
    gender: doc.gender,
    age: doc.age,
    addressline: doc.addressline,
    city: doc.city,
    state: doc.state,
    pincode: doc.pincode,
  };
};
