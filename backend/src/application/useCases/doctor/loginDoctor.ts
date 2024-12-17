import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginDoctor = async (
  doctorRepository: IDoctorRepository,
  data: { email: string; password: string }
): Promise<{ docToken: string; role: string, doctor: Record<string, any> }> => {
  const { email, password } = data;

  const doctor = await doctorRepository.findByEmail(email);
  if (!doctor) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, doctor.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (doctor.role !== "doctor") {
    throw new Error("Access denied: only doctors can log in");
  }

  const { password: _, ... rest} = doctor

  const docToken = jwt.sign(
    { id: doctor._id, email: doctor.email, fullName: doctor.fullName, role: doctor.role }, 
    process.env.JWT_SECRET as string, 
    { expiresIn: "1h" } 
  );

  return { docToken, role: doctor.role, doctor: rest };
};
