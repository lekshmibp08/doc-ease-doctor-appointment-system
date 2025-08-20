import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { AppError } from "../../shared/errors/appError";
import jwt from "jsonwebtoken";
import { GoogleOAuthLoginUseCase } from "../../application/useCases/implimentations/auth/googleOAuthLoginUseCase";
import { DoctorRepository } from "../../infrastructure/database/repositories/doctorRepository";
import { UserRepository } from "../../infrastructure/database/repositories/userRepository";

const doctorRepository = new DoctorRepository();
const userRepository = new UserRepository();
const googleOAuthLoginUseCase = new GoogleOAuthLoginUseCase(
  doctorRepository,
  userRepository
);

export const authController = {
  // Logout for all roles (User, Doctor, Admin)
  logout: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { role } = req.body;
      let cookieName = "";
      if (role === "user") {
        cookieName = "user_refresh_token";
      } else if (role === "doctor") {
        cookieName = "doctor_refresh_token";
      } else {
        cookieName = "admin_refresh_token";
      }

      res.clearCookie(cookieName, { httpOnly: true });
      res.status(HttpStatusCode.OK).json({ message: "Logout successful" });
    } catch (error: any) {
      next(error);
    }
  },

  googleLogin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { fullname, email, role, profilePicture } = req.body;

      if (!email || !role) {
        throw new AppError("Authentication failed", HttpStatusCode.BAD_REQUEST);
      }

      const data = { fullName: fullname, email, profilePicture, role };

      const {
        token,
        refreshToken,
        role: userRole,
        user,
      } = await googleOAuthLoginUseCase.execute(data);

      const userData = user;

      if (role === "user") {
        res.cookie("user_refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(HttpStatusCode.OK).json({ token, userData, role: userRole });
      }
      if (role === "doctor") {
        res.cookie("doctor_refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(HttpStatusCode.OK).json({ token, userData, role: userRole });
      }
    } catch (error: any) {
      next(error);
    }
  },

  refreshAccessToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { role } = req.body;

    let refresh_token;
    if (role === "user") {
      refresh_token = req.cookies["user_refresh_token"];
    } else if (role === "doctor") {
      refresh_token = req.cookies["doctor_refresh_token"];
    } else if (role === "admin") {
      refresh_token = req.cookies["admin_refresh_token"];
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Invalid role" });
    }

    if (!refresh_token) {
      return res.status(HttpStatusCode.FORBIDDEN).json({ message: "Refresh token not found" });
    }

    try {
      const decoded = jwt.verify(
        refresh_token,
        process.env.JWT_REFRESH_SECRET as string
      ) as jwt.JwtPayload;

      const { id, email, role } = decoded;

      if (!id || !email || !role) {
        throw new Error("Invalid token payload");
      }

      const newAccessToken = jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      );

      return res.status(HttpStatusCode.OK).json({ token: newAccessToken });
    } catch (error) {
      next(error);
    }
  },
};
