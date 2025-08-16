import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: "user",
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png",
    },
    gender: { type: String, default: "" },
    age: { type: String, default: "" },
    addressline: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
