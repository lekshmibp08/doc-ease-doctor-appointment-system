import { IOtpRepository } from "../../../../domain/repositories/IOtpRepository";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/HttpStatusCode";

export class VerifyOtpAndResetPassword {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IUserRepository
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

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user._id) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }

    await this.otpRepository.deleteOtp(email);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updates = { password: hashedPassword };

    await this.userRepository.updateUser(user?._id.toString(), updates);
  }
}
