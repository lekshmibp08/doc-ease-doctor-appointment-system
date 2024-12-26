import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";

export const verifyOtpAndResetDoctorPassword = async (
  otpRepository: IOtpRepository,
  doctorRepository: IDoctorRepository,
  data: { email: string; otp: string; newPassword: string; }
): Promise<void> => {
  const { email, otp, newPassword } = data;

  // Check OTP validity
  const otpEntity = await otpRepository.findOtp(email, otp);
  if (!otpEntity || new Date() > otpEntity.expiresAt) {
    throw new Error("Invalid or expired OTP");
  }

  const doctor = await doctorRepository.findByEmail(email);
  if (!doctor || !doctor._id) {
    throw new Error("User not found");
  }
  const id = doctor._id.toString();

  // Delete OTP after successful verification
  await otpRepository.deleteOtp(email);

  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updates = {password: hashedPassword}

  // Create a new user
  const updatedDoctor = await doctorRepository.updateDoctor(doctor?._id.toString(), updates );

};
