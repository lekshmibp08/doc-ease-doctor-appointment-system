import { Types } from "mongoose";

export interface Slot {
    _id?: Types.ObjectId | string;
    doctorId: Types.ObjectId | string;
    date: Date;
    timeSlots: { 
        time: string; 
        status: string; 
        isAvailable: boolean;
        _id?: Types.ObjectId
    }[];
};  