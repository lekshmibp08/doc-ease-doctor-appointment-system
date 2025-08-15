import { IVerifyOtpAndRegisterDocUseCase } from "../../interfaces/doctor/doctorUsecaseInterfaces";
import { IOtpRepository } from "../../../../domain/repositories/IOtpRepository";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { Doctor } from "../../../../domain/entities/doctor";
import bcrypt from "bcrypt";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { RegisterDoctorDTO } from "../../../../dtos/useCaseDtos/doctorUseCaseDtos";

export class VerifyOtpAndRegisterDocUseCase implements IVerifyOtpAndRegisterDocUseCase {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IDoctorRepository
  ) {}

  async execute(data: RegisterDoctorDTO): Promise<Doctor> {
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
