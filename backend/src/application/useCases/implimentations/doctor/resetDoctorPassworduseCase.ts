import { IOtpRepository } from "../../../../domain/repositories/IOtpRepository";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import bcrypt from "bcrypt";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/HttpStatusCode";

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
      throw new AppError("Invalid or expired OTP", HttpStatusCode.BAD_REQUEST);
    }

    const doctor = await this.doctorRepository.findByEmail(email);
    if (!doctor || !doctor._id) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }

    await this.otpRepository.deleteOtp(email);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updates = { password: hashedPassword };

    await this.doctorRepository.updateDoctor(doctor?._id, updates);
  }
}
