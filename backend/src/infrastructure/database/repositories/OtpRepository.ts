import OtpModel from "../models/OtpModel";
import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { Otp } from "../../../domain/entities/Otp";

export class OtpRepository implements IOtpRepository {
  async saveOtp (otp: Otp): Promise<void> {
    await OtpModel.create(otp);
  }
  async findOtp(email: string, otp: string): Promise<Otp | null> {
    const otpDoc = await OtpModel.findOne({ email, otp });
    return otpDoc ? { email: otpDoc.email, otp: otpDoc.otp, expiresAt: otpDoc.expiresAt } : null;
  }
  async deleteOtp(email: string): Promise<void> {
    await OtpModel.deleteOne({ email });
  }

}


