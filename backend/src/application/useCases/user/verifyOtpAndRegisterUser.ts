import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";

export const verifyOtpAndRegister = async (
  otpRepository: IOtpRepository,
  userRepository: IUserRepository,
  data: { email: string; otp: string; fullName: string; mobileNumber: string; password: string }
): Promise<User> => {
  const { email, otp, fullName, mobileNumber, password } = data;

  const otpEntity = await otpRepository.findOtp(email, otp);
  if (!otpEntity || new Date() > otpEntity.expiresAt) {
    throw new Error("Invalid or expired OTP");
  }

  await otpRepository.deleteOtp(email);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = { fullName, email, mobileNumber, password: hashedPassword, role: "user", isBlocked: false };
  return await userRepository.create(user);
};
