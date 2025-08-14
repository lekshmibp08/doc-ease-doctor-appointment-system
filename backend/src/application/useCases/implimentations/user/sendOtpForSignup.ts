import { IOtpRepository } from "../../../../domain/repositories/IOtpRepository";
import { Otp } from "../../../../domain/entities/otp";
import { sendEmail } from "../../../../infrastructure/services/emailService";

export class SendOtpForSignupUseCase {
  constructor(private otpRepository: IOtpRepository) {}

  async execute(email: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("OTP : ", otp);

    const otpEntity: Otp = {
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };

    await this.otpRepository.saveOtp(otpEntity);

    await sendEmail(
      email,
      "Your OTP for Signup Verification",
      `Your OTP is ${otp}. It expires in 2 minutes.`
    );
  }
}
