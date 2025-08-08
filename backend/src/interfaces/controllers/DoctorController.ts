import { NextFunction, Request, Response } from "express";
import { OtpRepository } from "../../infrastructure/database/repositories/OtpRepository";
import { DoctorRepository } from "../../infrastructure/database/repositories/DoctorRepository";
import { SendOtpForSignupUseCase } from "../../application/useCases/user/sendOtpForSignup";
import { VerifyOtpAndRegisterDocUseCase } from "../../application/useCases/doctor/verifyOtpAndRegisterDoc";
import { LoginDoctorUseCase } from "../../application/useCases/doctor/loginDoctorUseCase";
import { SendOtpForResetPassword } from "../../application/useCases/user/sendOtpForResetPassword";
import { VerifyOtpAndResetDoctorPassword } from "../../application/useCases/doctor/ResetDoctorPassworduseCase";
import { UpdateDocProfile } from "../../application/useCases/doctor/updateDocProfileUseCase";
import { AppointmentRepository } from "../../infrastructure/database/repositories/AppoinmentRepository";
import { GetDashboardStatsUseCase } from "../../application/useCases/doctor/getDashboardStatsUseCase";

const otpRepository = new OtpRepository();
const sendOtpForSignupUseCase = new SendOtpForSignupUseCase(otpRepository);
const sendOtpForResetPassword = new SendOtpForResetPassword(otpRepository);
const doctorRepository = new DoctorRepository();
const verifyOtpAndRegisterDocUseCase = new VerifyOtpAndRegisterDocUseCase(
  otpRepository,
  doctorRepository
);
const loginDoctorUseCase = new LoginDoctorUseCase(doctorRepository);
const verifyOtpAndResetDoctorPassword = new VerifyOtpAndResetDoctorPassword(
  otpRepository,
  doctorRepository
);
const updateDocProfile = new UpdateDocProfile(doctorRepository);
const appoinmentRepository = new AppointmentRepository();
const getDashboardStatsUseCase = new GetDashboardStatsUseCase(
  appoinmentRepository
);

export const doctorController = {
  // Send OTP during signup
  register: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ message: "Passwords entered are not matching...!" });
      return;
    }

    try {
      const existingDoctor = await doctorRepository.findByEmail(email);
      if (existingDoctor) {
        res.status(400).json({ message: "Email is already registered" });
        return;
      }
      await sendOtpForSignupUseCase.execute(email);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      next(error);
    }
  },

  // Verify OTP and register doctor
  verifyOtpAndRegisterUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, otp, fullName, mobileNumber, registerNumber, password } =
      req.body;

    try {
      const doctor = await verifyOtpAndRegisterDocUseCase.execute({
        email,
        otp,
        fullName,
        mobileNumber,
        registerNumber,
        password,
      });
      res.status(201).json({
        message:
          "OTP verified and Doctor registered successfully, You can now log in and update profile..!",
        doctor,
      });
    } catch (error: any) {
      next(error);
    }
  },

  // Doctor Login
  login: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and Password are required" });
        return;
      }

      const { token, refreshToken, role, doctor } =
        await loginDoctorUseCase.execute({ email, password });

      const userData = doctor;

      res.cookie("doctor_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        token,
        refreshToken,
        role,
        userData,
      });
    } catch (error: any) {
      next(error);
    }
  },

  //Send OTP for forget Password
  sendOtpForForgetPassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email } = req.body;

    try {
      const existingUser = await doctorRepository.findByEmail(email);
      if (!existingUser) {
        res.status(400).json({ message: "Please enter valid Email id" });
        return;
      }
      await sendOtpForResetPassword.execute(email);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      next(error);
    }
  },

  //Verify the OTP and reset password verifyOtpAndResetDoctorPassword
  verifyAndResetPassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email, newPassword, otp } = req.body;

    try {
      await verifyOtpAndResetDoctorPassword.execute({
        email,
        newPassword,
        otp,
      });
      res.status(200).json({
        message: "Password changed successfully, You can now log in..!",
      });
    } catch (error: any) {
      next(error);
    }
  },

  //Update Doctor profile
  updateDoctorProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedDocProfile = await updateDocProfile.execute(id, updatedData);

      res.status(200).json({
        message: "User Profile Updated Successfully..!",
        updatedDocProfile,
      });
    } catch (error: any) {
      next(error);
    }
  },

  getDashboardData: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { doctorId, startDate, endDate } = req.body;

    try {
      const stats = await getDashboardStatsUseCase.execute(
        doctorId,
        new Date(startDate),
        new Date(endDate)
      );
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  },
};
