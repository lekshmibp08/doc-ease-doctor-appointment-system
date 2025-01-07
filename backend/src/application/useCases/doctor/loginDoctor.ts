import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginDoctor = async (
  doctorRepository: IDoctorRepository,
  data: { email: string; password: string }
): Promise<{ token: string; refreshToken: string; role: string, doctor: Record<string, any> }> => {
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

  const token = jwt.sign(
      { id: doctor._id, email: doctor.email, role: doctor.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" } // Short-lived access token
    );
  
    const refreshToken = jwt.sign(
      { id: doctor._id, email: doctor.email, role: doctor.role },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" } // Long-lived refresh token
    );

  return { token, refreshToken, role: doctor.role, doctor: rest };
};
