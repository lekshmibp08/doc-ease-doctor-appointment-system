import { NextFunction, Request, Response } from "express";
import { SendOtpForSignupUseCase } from "../../application/useCases/implimentations/user/sendOtpForSignup";
import { VerifyOtpAndRegister } from "../../application/useCases/implimentations/user/verifyOtpAndRegisterUser";
import { OtpRepository } from "../../infrastructure/database/repositories/otpRepository";
import { DoctorRepository } from "../../infrastructure/database/repositories/doctorRepository";
import { ListApprovedDoctors } from "../../application/useCases/implimentations/user/listApprovedDoctors";
import { UpdateUser } from "../../application/useCases/implimentations/user/updateUser";
import { SendOtpForResetPassword } from "../../application/useCases/implimentations/user/sendOtpForResetPassword";
import { VerifyOtpAndResetPassword } from "../../application/useCases/implimentations/user/verifyOtpAndResetPassword";
import { DoctorDetails } from "../../application/useCases/implimentations/user/doctorDetails";
import { FetchSpecializationsUseCase } from "../../application/useCases/implimentations/user/fetchSpecializationsUseCase";
import { UserLoginUseCase } from "../../application/useCases/implimentations/user/userLoginUseCase";
import { UserRepository } from "../../infrastructure/database/repositories/userRepository";

const userRepository = new UserRepository();
const userLoginUseCase = new UserLoginUseCase(userRepository);
const otpRepository = new OtpRepository();
const sendOtpForSignupUseCase = new SendOtpForSignupUseCase(otpRepository);
const verifyOtpAndRegister = new VerifyOtpAndRegister(
  otpRepository,
  userRepository
);
const updateUser = new UpdateUser(userRepository);
const sendOtpForResetPassword = new SendOtpForResetPassword(otpRepository);
const verifyOtpAndResetPassword = new VerifyOtpAndResetPassword(
  otpRepository,
  userRepository
);
const doctorRepository = new DoctorRepository();
const listApprovedDoctors = new ListApprovedDoctors(doctorRepository);
const fetchSpecializationsUseCase = new FetchSpecializationsUseCase(
  doctorRepository
);
const doctorDetails = new DoctorDetails(doctorRepository);

export const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ message: "Passwords entered are not matching...!" });
      return;
    }

    try {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: "Email is already registered" });
        return;
      }
      await sendOtpForSignupUseCase.execute(email);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      next(error);
    }
  },

  // Verify OTP and register user
  verifyOtpAndRegisterUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, otp, fullName, mobileNumber, password } = req.body;

    try {
      const user = await verifyOtpAndRegister.execute({
        email,
        otp,
        fullName,
        mobileNumber,
        password,
      });
      res.status(201).json({
        message:
          "OTP verified and User registered successfully, You can now log in..!",
        user,
      });
    } catch (error: any) {
      next(error);
    }
  },

  login: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const { token, refreshToken, role, user } =
        await userLoginUseCase.execute({
          email,
          password,
        });

      const userData = user;

      res.cookie("user_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ message: "Login successful", token, role, userData });
    } catch (error: any) {
      next(error);
    }
  },

  // List all approved doctors
  getDoctors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        size,
        search,
        locationName,
        latitude,
        longitude,
        gender,
        experience,
        availability,
        fees,
        department,
        sort,
      } = req.query;

      const result = await listApprovedDoctors.execute({
        page: Number(page),
        size: Number(size),
        search: search as string,
        locationName: locationName as string,
        latitude: Number(latitude),
        longitude: Number(longitude),
        gender: gender as string,
        experience: experience as string,
        availability: availability as string,
        fee: fees as string,
        department: department as string,
        sort: sort as string,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // List Specializations
  listSpecializations: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const specializations = await fetchSpecializationsUseCase.execute();
      res.json({ specializations });
    } catch (error: any) {
      next(error);
    }
  },

  // Update User profile
  updateUserProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedUser = await updateUser.execute(id, updatedData);

      res
        .status(200)
        .json({ message: "User Profile Updated Successfully..!", updatedUser });
    } catch (error: any) {
      console.error("Error in updateDoctorProfile:", error.message);

      if (error.message === "Doctor not found") {
        res.status(404).json({ message: "Doctor not found" });
        return;
      }

      if (error.message === "Current password is incorrect") {
        res.status(400).json({ message: "Current password is incorrect" });
        return;
      }

      res
        .status(500)
        .json({ message: "Failed to update profile", error: error.message });
      return;
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
      const existingUser = await userRepository.findByEmail(email);
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

  //Verify the OTP and reset password
  verifyAndResetPassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, newPassword, otp } = req.body;

    try {
      await verifyOtpAndResetPassword.execute({ email, newPassword, otp });
      res.status(200).json({
        message: "Password changed successfully, You can now log in..!",
      });
    } catch (error: any) {
      next(error);
    }
  },

  // Get doctor Details
  getDoctorDetails: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const details = await doctorDetails.execute(id);
      res.status(200).json(details);
    } catch (error: any) {
      next(error);
    }
  },
};
