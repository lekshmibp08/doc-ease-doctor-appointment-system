import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { Otp } from "../../../domain/entities/Otp";
import { sendEmail } from "../../../infrastructure/web/services/EmailService";

export const sendOtpForResetPassword = async (
  otpRepository: IOtpRepository,
  email: string
): Promise<void> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log('OTP : ', otp);
  
  const otpEntity: Otp = {
    email,
    otp,
    expiresAt: new Date(Date.now() + 2 * 60 * 1000), 
  };

  await otpRepository.saveOtp(otpEntity);


  await sendEmail(
    email,
    "DocEase: OTP for Reset Password",
    `Your OTP for resetting the password is ${otp}. It expires in 2 minutes.`
  );
};
