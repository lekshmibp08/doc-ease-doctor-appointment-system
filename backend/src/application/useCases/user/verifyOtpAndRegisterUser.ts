import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IUser } from "../../../domain/entities/User";
import bcrypt from "bcrypt";

export class VerifyOtpAndRegister {
  constructor(private otpRepository: IOtpRepository, private userRepository: IUserRepository,){}

  async execute (
    data: { email: string; otp: string; fullName: string; mobileNumber: string; password: string }
  ): Promise<IUser> {
    const { email, otp, fullName, mobileNumber, password } = data;
  
    const otpEntity = await this.otpRepository.findOtp(email, otp);
    if (!otpEntity || new Date() > otpEntity.expiresAt) {
      throw new Error("Invalid or expired OTP");
    }
  
    await this.otpRepository.deleteOtp(email);
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user: IUser = { fullName, email, mobileNumber, password: hashedPassword, role: "user", isBlocked: false };
    return await this.userRepository.create(user);
  }
}

