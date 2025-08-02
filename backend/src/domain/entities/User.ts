import { Types } from "mongoose";

export interface User {
    _id?: Types.ObjectId; 
    fullName: string;
    email: string;
    profilePicture?: string;
    mobileNumber: string;
    password: string;
    role: "user" | "doctor" | "admin";
    isBlocked: boolean;
};
