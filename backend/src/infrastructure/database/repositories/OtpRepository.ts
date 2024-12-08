import OtpModel from "../models/OtpModel";
import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { Otp } from "../../../domain/entities/Otp";

export const createOtpRepository = (): IOtpRepository => ({
  saveOtp: async (otp) => {
    await OtpModel.create(otp);
  },
  findOtp: async (email, otp) => {
    const otpDoc = await OtpModel.findOne({ email, otp });
    return otpDoc ? { email: otpDoc.email, otp: otpDoc.otp, expiresAt: otpDoc.expiresAt } : null;
  },
  deleteOtp: async (email) => {
    await OtpModel.deleteOne({ email });
  },
});
