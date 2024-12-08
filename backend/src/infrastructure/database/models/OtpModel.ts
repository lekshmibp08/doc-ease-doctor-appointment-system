import mongoose, { Schema, Document } from "mongoose";
import { Otp } from "../../../domain/entities/Otp";

interface IOtpDocument extends Document, Otp {}

const OtpSchema = new Schema<IOtpDocument>({
    email: { 
        type: String, 
        required: true 
    },
    otp: { 
        type: String, 
        required: true 
    },
    expiresAt: { 
        type: Date, 
        required: true 
    },
});

export default mongoose.model<IOtpDocument>("Otp", OtpSchema);
