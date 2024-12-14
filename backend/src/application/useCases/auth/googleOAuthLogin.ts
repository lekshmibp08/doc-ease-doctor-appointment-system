import jwt from "jsonwebtoken";
import { createDoctorRepository } from "../../../infrastructure/database/repositories/DoctorRepository";
import { createUserRepository } from "../../../infrastructure/database/repositories/UserRepository";

export const googleOAuthLogin = async (
  fullName: string,
  email: string,
  role: "doctor" | "user" | "admin",
): Promise<{ authToken: string; role: string }> => {
  let entity;

  console.log("FULLNAME RECEIVED: ", fullName);
  

  // Determine repository
  if (role === "doctor") {
    const doctorRepository = createDoctorRepository();
    entity = await doctorRepository.findByEmail(email);
    if (!entity) {
      entity = await doctorRepository.create({
        fullName: fullName || "",
        email: email,
        mobileNumber: "",
        registerNumber: "",
        password: "",
        role: "doctor",
        isApproved: false,
        isBlocked: false,
      });
    }
  } else {
    const userRepository = createUserRepository();
    entity = await userRepository.findByEmail(email);
    if (!entity) {
      entity = await userRepository.create({
        fullName: fullName || "",
        email: email,
        mobileNumber: "",
        password: "",
        role: "user",
        isBlocked: false,
      });
    }
  }

  // Generate JWT token
  const authToken = jwt.sign(
    { id: entity._id, email: entity.email, fullName: entity.fullName, role: entity.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return { authToken, role: entity.role };
};
