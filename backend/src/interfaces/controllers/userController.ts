import type { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { AppError } from "../../shared/errors/appError";

import { SendOtpForSignupUseCase } from "../../application/useCases/implimentations/user/sendOtpForSignup";
import { VerifyOtpAndRegister } from "../../application/useCases/implimentations/user/verifyOtpAndRegisterUser";
import { ListApprovedDoctors } from "../../application/useCases/implimentations/user/listApprovedDoctors";
import { UpdateUser } from "../../application/useCases/implimentations/user/updateUser";
import { SendOtpForResetPassword } from "../../application/useCases/implimentations/user/sendOtpForResetPassword";
import { VerifyOtpAndResetPassword } from "../../application/useCases/implimentations/user/verifyOtpAndResetPassword";
import { DoctorDetails } from "../../application/useCases/implimentations/user/doctorDetails";
import { FetchSpecializationsUseCase } from "../../application/useCases/implimentations/user/fetchSpecializationsUseCase";
import { UserLoginUseCase } from "../../application/useCases/implimentations/user/userLoginUseCase";
import { FindExistingUserUseCase } from "../../application/useCases/implimentations/user/findExistingUserUseCase";

export class UserController {
  constructor(
    private sendOtpForSignupUseCase: SendOtpForSignupUseCase,
    private verifyOtpAndRegister: VerifyOtpAndRegister,
    private userLoginUseCase: UserLoginUseCase,
    private findExistingUserUseCase: FindExistingUserUseCase,
    private updateUser: UpdateUser,
    private sendOtpForResetPassword: SendOtpForResetPassword,
    private verifyOtpAndResetPassword: VerifyOtpAndResetPassword,
    private listApprovedDoctors: ListApprovedDoctors,
    private fetchSpecializationsUseCase: FetchSpecializationsUseCase,
    private doctorDetails: DoctorDetails
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Passwords entered are not matching...!" });
      return;
    }

    try {
      const existingUser = await this.findExistingUserUseCase.execute(email);
      if (existingUser) {
        throw new AppError("Email is already registered", HttpStatusCode.BAD_REQUEST);
      }
      await this.sendOtpForSignupUseCase.execute(email);
      res.status(HttpStatusCode.OK).json({ message: "OTP sent successfully" });
    } catch (error) {
      next(error);
    }
  };

  verifyOtpAndRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, fullName, mobileNumber, password } = req.body;

    try {
      const user = await this.verifyOtpAndRegister.execute({
        email,
        otp,
        fullName,
        mobileNumber,
        password,
      });
      res.status(HttpStatusCode.CREATED).json({
        message: "OTP verified and User registered successfully, You can now log in..!",
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const { token, refreshToken, role, user } = await this.userLoginUseCase.execute({ email, password });

      res.cookie("user_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({ message: "Login successful", token, role, userData: user });
    } catch (error) {
      next(error);
    }
  };

  getDoctors = async (req: Request, res: Response, next: NextFunction) => {
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

      const result = await this.listApprovedDoctors.execute({
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

      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  listSpecializations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specializations = await this.fetchSpecializationsUseCase.execute();
      res.json({ specializations });
    } catch (error) {
      next(error);
    }
  };

  updateUserProfile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedUser = await this.updateUser.execute(id, req.body);

      res.status(HttpStatusCode.OK).json({
        message: "User Profile Updated Successfully..!",
        updatedUser,
      });
    } catch (error: any) {
      if (error.message === "Doctor not found") {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "Doctor not found" });
        return;
      }
      if (error.message === "Current password is incorrect") {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Current password is incorrect" });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to update profile", error: error.message });
    }
  };

  sendOtpForForgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    try {
      const existingUser = await this.findExistingUserUseCase.execute(email);
      if (!existingUser) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Please enter valid Email id" });
        return;
      }
      await this.sendOtpForResetPassword.execute(email);
      res.status(HttpStatusCode.OK).json({ message: "OTP sent successfully" });
    } catch (error) {
      next(error);
    }
  };

  verifyAndResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email, newPassword, otp } = req.body;

    try {
      await this.verifyOtpAndResetPassword.execute({ email, newPassword, otp });
      res.status(HttpStatusCode.OK).json({ message: "Password changed successfully, You can now log in..!" });
    } catch (error) {
      next(error);
    }
  };

  getDoctorDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const details = await this.doctorDetails.execute(req.params.id);
      res.status(HttpStatusCode.OK).json(details);
    } catch (error) {
      next(error);
    }
  };
}
