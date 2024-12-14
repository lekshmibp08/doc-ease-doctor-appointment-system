import { Types } from "mongoose";

export type User = {
    _id?: Types.ObjectId; // Unique identifier for Mongoose models
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    role: "user" | "doctor" | "admin";
    isBlocked: boolean;
};
