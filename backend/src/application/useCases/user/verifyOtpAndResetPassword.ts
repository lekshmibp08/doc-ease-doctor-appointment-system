import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";

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
      throw new Error("Invalid or expired OTP");
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user._id) {
      throw new Error("User not found");
    }

    await this.otpRepository.deleteOtp(email);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updates = { password: hashedPassword };

    await this.userRepository.updateUser(user?._id.toString(), updates);
  }
}
