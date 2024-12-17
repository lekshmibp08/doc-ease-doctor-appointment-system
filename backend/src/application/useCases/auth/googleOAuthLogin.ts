import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createDoctorRepository } from "../../../infrastructure/database/repositories/DoctorRepository";
import { createUserRepository } from "../../../infrastructure/database/repositories/UserRepository";

export const googleOAuthLogin = async (
  fullName: string,
  email: string,
  profilePicture: string,
  role: "doctor" | "user" | "admin",
): Promise<{ authToken: string; user: Record<string, any>;  role: string }> => {
  let entity;
  

  // Determine repository
  if (role === "doctor") {
    const doctorRepository = createDoctorRepository();
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
    const userRepository = createUserRepository();
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

  const { password: _, ...rest } = entity

  // Generate JWT token
  const authToken = jwt.sign(
    { id: entity._id, email: entity.email, role: entity.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  console.log("REST: ", rest);
  

  return { authToken, user: rest, role: entity.role };
};
