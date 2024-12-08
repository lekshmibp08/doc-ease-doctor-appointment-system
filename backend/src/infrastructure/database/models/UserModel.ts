import mongoose, { Schema, Document } from "mongoose";
import { User } from "../../../domain/entities/User";

interface IUserDocument extends Document, User {}

const UserSchema = new Schema<IUserDocument>({
      fullName: { 
        type: String, 
        required: true 
    },
      email: { 
        type: String, 
        required: true, 
        unique: true 
    },
      mobileNumber: { 
        type: String, 
        required: true 
    },
      password: { 
        type: String, 
        required: true 
    },
});

export default mongoose.model<IUserDocument>("User", UserSchema);
