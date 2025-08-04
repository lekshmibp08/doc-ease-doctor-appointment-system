import { Types } from "mongoose";

export class IUser {
    constructor(
        public fullName: string,
        public email: string,
        public mobileNumber: string,
        public password: string,
        public role: "user" | "doctor" | "admin",
        public isBlocked: boolean,
        public _id?: Types.ObjectId, 
        public profilePicture?: string,
    ){}
};
