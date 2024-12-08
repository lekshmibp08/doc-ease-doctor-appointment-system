import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { Otp } from "../../../domain/entities/Otp";
import { sendEmail } from "../../../infrastructure/web/services/EmailService";

export const sendOtpForSignup = async (
  otpRepository: IOtpRepository,
  email: string
): Promise<void> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpEntity: Otp = {
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 15 minutes
  };

  await otpRepository.saveOtp(otpEntity);


  await sendEmail(
    email,
    "Your OTP for Signup Verification",
    `Your OTP is ${otp}. It expires in 5 minutes.`
  );
};
