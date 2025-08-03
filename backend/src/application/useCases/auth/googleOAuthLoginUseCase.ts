/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { DoctorRepository } from "../../../infrastructure/database/repositories/DoctorRepository";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";

const doctorRepository = new DoctorRepository();

export const googleOAuthLogin = async (
  fullName: string,
  email: string,
  profilePicture: string,
  role: "doctor" | "user" | "admin",
): Promise<{ token: string; refreshToken: string; user: Record<string, any>;  role: string }> => {
  let entity;
  

  // Determine repository
  if (role === "doctor") {
    entity = await doctorRepository.findByEmail(email);
    
    if (!entity) {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashPassword = bcrypt.hashSync(generatedPassword, 10);
      entity = await doctorRepository.create({
        fullName: fullName || "",
        email: email,
        profilePicture: profilePicture,
        mobileNumber: "",
        registerNumber: "",
        password: hashPassword,
        role: "doctor",
        isApproved: false,
        isBlocked: false,
      });
    }
  } else {
    const userRepository = new UserRepository;
    entity = await userRepository.findByEmail(email);    

    if (!entity) {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashPassword = bcrypt.hashSync(generatedPassword, 10);      
      entity = await userRepository.create({
        fullName: fullName || "",
        email: email,
        profilePicture: profilePicture,
        mobileNumber: "",
        password: hashPassword,
        role: "user",
        isBlocked: false,
      });
    }
  }

  const { password: _password, ...rest } = entity;

  console.log("REST: ", rest);

  const token = jwt.sign(
      { id: entity._id, email: entity.email, role: entity.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" } // Short-lived access token
    );
  
    const refreshToken = jwt.sign(
      { id: entity._id, email: entity.email, role: entity.role },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" } // Long-lived refresh token
    );  
  

  return { token, refreshToken, user: rest, role: entity.role };
};
