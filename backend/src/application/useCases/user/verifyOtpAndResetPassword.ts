import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";

export const verifyOtpAndResetPassword = async (
  otpRepository: IOtpRepository,
  userRepository: IUserRepository,
  data: { email: string; otp: string; newPassword: string; }
): Promise<void> => {
  const { email, otp, newPassword } = data;

  const otpEntity = await otpRepository.findOtp(email, otp);
  if (!otpEntity || new Date() > otpEntity.expiresAt) {
    throw new Error("Invalid or expired OTP");
  }

  const user = await userRepository.findByEmail(email);
  if (!user || !user._id) {
    throw new Error("User not found");
  }

  await otpRepository.deleteOtp(email);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updates = {password: hashedPassword}

  await userRepository.updateUser(user?._id.toString(), updates );

};
