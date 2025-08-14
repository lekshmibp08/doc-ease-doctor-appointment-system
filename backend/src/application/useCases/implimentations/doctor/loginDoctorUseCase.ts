/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";

export class LoginDoctorUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(data: { email: string; password: string }): Promise<{
    token: string;
    refreshToken: string;
    role: string;
    doctor: Record<string, any>;
  }> {
    const { email, password } = data;

    const doctor = await this.doctorRepository.findByEmail(email);
    if (!doctor) {
      throw new AppError(
        "Invalid email or password",
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password",
        HttpStatusCode.UNAUTHORIZED
      );
    }

    if (doctor.role !== "doctor") {
      throw new AppError(
        "Access denied: only doctors can log in",
        HttpStatusCode.FORBIDDEN
      );
    }

    const { password: _, ...rest } = doctor;

    const token = jwt.sign(
      { id: doctor._id, email: doctor.email, role: doctor.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: doctor._id, email: doctor.email, role: doctor.role },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    return { token, refreshToken, role: doctor.role, doctor: rest };
  }
}
