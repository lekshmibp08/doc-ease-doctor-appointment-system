import mongoose, { Schema, model } from "mongoose";
import { User } from "../../../domain/entities/User";

interface IUserDocument extends Document, Omit<User, "_id"> {
    _id: mongoose.Types.ObjectId; 
    profilePicture: string;
    gender: string;
    age: string;
    addressline: string;
    city: string;
    state: string;
    pincode: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobileNumber: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "doctor", "admin"],
            default: "user",
            required: true,
        },
        profilePicture: {
          type: String,
          default: 'https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png',          
        },
        gender: {
          type: String,
          default: "",
        },
        age: {
          type: String,
          default: "",
        },
        addressline: {
          type: String,
          default: "",
        },
        city: {
          type: String,
          default: "",
        },
        state: {
          type: String,
          default: "",
        },
        pincode: {
          type: String,
          default: "",
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

export default model<IUserDocument>("User", UserSchema);
