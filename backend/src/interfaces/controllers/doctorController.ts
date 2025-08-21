import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";

import { SendOtpForSignupUseCase } from "../../application/useCases/implimentations/user/sendOtpForSignup";
import { VerifyOtpAndRegisterDocUseCase } from "../../application/useCases/implimentations/doctor/verifyOtpAndRegisterDoc";
import { LoginDoctorUseCase } from "../../application/useCases/implimentations/doctor/loginDoctorUseCase";
import { SendOtpForResetPassword } from "../../application/useCases/implimentations/user/sendOtpForResetPassword";
import { VerifyOtpAndResetDoctorPassword } from "../../application/useCases/implimentations/doctor/resetDoctorPassworduseCase";
import { UpdateDocProfile } from "../../application/useCases/implimentations/doctor/updateDocProfileUseCase";
import { GetDashboardStatsUseCase } from "../../application/useCases/implimentations/doctor/getDashboardStatsUseCase";
import { FindExistingDoctorUseCase } from "../../application/useCases/implimentations/doctor/findExistingDoctorUseCase";

export class DoctorController {
  constructor(
    private findExistingDoctorUseCase: FindExistingDoctorUseCase,
    private sendOtpForSignupUseCase: SendOtpForSignupUseCase,
    private sendOtpForResetPassword: SendOtpForResetPassword,
    private verifyOtpAndRegisterDocUseCase: VerifyOtpAndRegisterDocUseCase,
    private loginDoctorUseCase: LoginDoctorUseCase,
    private verifyOtpAndResetDoctorPassword: VerifyOtpAndResetDoctorPassword,
    private updateDocProfile: UpdateDocProfile,
    private getDashboardStatsUseCase: GetDashboardStatsUseCase
  ) {}

  // Send OTP during signup
  register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Passwords entered are not matching...!" });
      return;
    }

    try {
      const existingDoctor = await this.findExistingDoctorUseCase.execute(email);
      if (existingDoctor) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Email is already registered" });
        return;
      }
      await this.sendOtpForSignupUseCase.execute(email);
      res.status(HttpStatusCode.OK).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      next(error);
    }
  };

  // Verify OTP and register doctor
  verifyOtpAndRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, fullName, mobileNumber, registerNumber, password } = req.body;

    try {
      const doctor = await this.verifyOtpAndRegisterDocUseCase.execute({
        email,
        otp,
        fullName,
        mobileNumber,
        registerNumber,
        password,
      });
      res.status(HttpStatusCode.CREATED).json({
        message:
          "OTP verified and Doctor registered successfully, You can now log in and update profile..!",
        doctor,
      });
    } catch (error: any) {
      next(error);
    }
  };

  // Doctor Login
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Email and Password are required" });
        return;
      }

      const { token, refreshToken, role, doctor } =
        await this.loginDoctorUseCase.execute({ email, password });

      const userData = doctor;

      res.cookie("doctor_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({
        message: "Login successful",
        token,
        refreshToken,
        role,
        userData,
      });
    } catch (error: any) {
      next(error);
    }
  };

  // Send OTP for forget Password
  sendOtpForForgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    try {
      const existingUser = await this.findExistingDoctorUseCase.execute(email);
      if (!existingUser) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Please enter valid Email id" });
        return;
      }
      await this.sendOtpForResetPassword.execute(email);
      res.status(HttpStatusCode.OK).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      next(error);
    }
  };

  // Verify OTP and reset password
  verifyAndResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, newPassword, otp } = req.body;

    try {
      await this.verifyOtpAndResetDoctorPassword.execute({
        email,
        newPassword,
        otp,
      });
      res.status(HttpStatusCode.OK).json({
        message: "Password changed successfully, You can now log in..!",
      });
    } catch (error: any) {
      next(error);
    }
  };

  // Update Doctor profile
  updateDoctorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedDocProfile = await this.updateDocProfile.execute(id, updatedData);

      res.status(HttpStatusCode.OK).json({
        message: "User Profile Updated Successfully..!",
        updatedDocProfile,
      });
    } catch (error: any) {
      next(error);
    }
  };

  // Get Dashboard Stats
  getDashboardData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { doctorId, startDate, endDate } = req.body;

    try {
      const stats = await this.getDashboardStatsUseCase.execute(
        doctorId,
        new Date(startDate),
        new Date(endDate)
      );
      res.status(HttpStatusCode.OK).json(stats);
    } catch (error) {
      next(error);
    }
  };
}
