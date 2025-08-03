import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import bcrypt from "bcrypt";

export class VerifyOtpAndResetDoctorPassword {
  constructor(
    private otpRepository: IOtpRepository,
    private doctorRepository: IDoctorRepository
  ) {}
  async execute(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<void> {
    const { email, otp, newPassword } = data;

    const otpEntity = await this.otpRepository.findOtp(email, otp);
    if (!otpEntity || new Date() > otpEntity.expiresAt) {
      throw new Error("Invalid or expired OTP");
    }

    const doctor = await this.doctorRepository.findByEmail(email);
    if (!doctor || !doctor._id) {
      throw new Error("User not found");
    }

    await this.otpRepository.deleteOtp(email);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updates = { password: hashedPassword };

    await this.doctorRepository.updateDoctor(doctor?._id.toString(), updates);
  }
}
