import bcrypt from "bcrypt";
import { IVerifyOtpAndRegisterUseCase } from "../../interfaces/user/userUseCaseInterfaces";
import { IOtpRepository } from "../../../../domain/repositories/IOtpRepository";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IUser } from "../../../../domain/entities/user";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { VerifyOtpAndRegisterDTO } from "../../../../dtos/useCaseDtos/userUseCaseDtos";

export class VerifyOtpAndRegister implements IVerifyOtpAndRegisterUseCase {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: VerifyOtpAndRegisterDTO): Promise<IUser> {
    const { email, otp, fullName, mobileNumber, password } = data;

    const otpEntity = await this.otpRepository.findOtp(email, otp);
    if (!otpEntity || new Date() > otpEntity.expiresAt) {
      throw new AppError("Invalid or expired OTP", HttpStatusCode.BAD_REQUEST);
    }

    await this.otpRepository.deleteOtp(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = {
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      role: "user",
      isBlocked: false,
    };
    return await this.userRepository.create(user);
  }
}
