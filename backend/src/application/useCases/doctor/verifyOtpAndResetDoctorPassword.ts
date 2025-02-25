import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import bcrypt from "bcrypt";

export const verifyOtpAndResetDoctorPassword = async (
  otpRepository: IOtpRepository,
  doctorRepository: IDoctorRepository,
  data: { email: string; otp: string; newPassword: string; }
): Promise<void> => {
  const { email, otp, newPassword } = data;

  const otpEntity = await otpRepository.findOtp(email, otp);
  if (!otpEntity || new Date() > otpEntity.expiresAt) {
    throw new Error("Invalid or expired OTP");
  }

  const doctor = await doctorRepository.findByEmail(email);
  if (!doctor || !doctor._id) {
    throw new Error("User not found");
  }

  await otpRepository.deleteOtp(email);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updates = {password: hashedPassword}

  await doctorRepository.updateDoctor(doctor?._id.toString(), updates );

};
