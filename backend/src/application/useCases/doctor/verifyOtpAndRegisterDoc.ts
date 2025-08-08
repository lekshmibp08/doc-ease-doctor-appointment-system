import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { Doctor } from "../../../domain/entities/Doctor";
import bcrypt from "bcrypt";
import { AppError } from "../../../shared/errors/appError";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";

export class VerifyOtpAndRegisterDocUseCase {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IDoctorRepository
  ) {}

  async execute(data: {
    email: string;
    otp: string;
    fullName: string;
    mobileNumber: string;
    registerNumber: string;
    password: string;
  }): Promise<Doctor> {
    const { email, otp, fullName, mobileNumber, registerNumber, password } =
      data;

    const otpEntity = await this.otpRepository.findOtp(email, otp);
    if (!otpEntity || new Date() > otpEntity.expiresAt) {
      throw new AppError("Invalid or expired OTP", HttpStatusCode.BAD_REQUEST);
    }

    await this.otpRepository.deleteOtp(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor: Doctor = {
      fullName,
      email,
      mobileNumber,
      registerNumber,
      password: hashedPassword,
      role: "doctor",
      isApproved: false,
      isBlocked: false,
    };
    return await this.userRepository.create(doctor);
  }
}
