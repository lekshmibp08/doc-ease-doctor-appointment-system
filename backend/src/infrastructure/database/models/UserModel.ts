import mongoose, { Schema, model } from "mongoose";
import { User } from "../../../domain/entities/User";

interface IUserDocument extends Document, Omit<User, "_id"> {
    _id: mongoose.Types.ObjectId; // Mongoose ObjectId for the _id field
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
