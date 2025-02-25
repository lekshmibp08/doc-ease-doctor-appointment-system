 
 
import { Request, Response} from "express";
import { createOtpRepository } from "../../database/repositories/OtpRepository"; 
import { createDoctorRepository } from "../../database/repositories/DoctorRepository";
import { sendOtpForSignup } from "../../../application/useCases/user/sendOtpForSignup";
import { verifyOtpAndRegisterDoc } from "../../../application/useCases/doctor/verifyOtpAndRegisterDoc";
import { loginDoctor } from "../../../application/useCases/doctor/loginDoctor";
import { sendOtpForResetPassword } from "../../../application/useCases/user/sendOtpForResetPassword";
import { verifyOtpAndResetDoctorPassword } from "../../../application/useCases/doctor/verifyOtpAndResetDoctorPassword";
import { updateDocProfile } from "../../../application/useCases/doctor/updateDocProfile";
import { createAppointmentRepository } from "../../database/repositories/AppoinmentRepository";
import { GetDashboardStatsUseCase } from "../../../application/useCases/doctor/getDashboardStatsUseCase";

export const doctorController = {
    // Send OTP during signup
    register: async (req: Request, res: Response) => {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
          res.status(400).json({ message: "Passwords entered are not matching...!" });
          return;
        }

        const otpRepository = createOtpRepository();
        const doctorRepository = createDoctorRepository();

        try {
          // Check if the email already exists in the user database
          const existingDoctor = await doctorRepository.findByEmail(email);
          if(existingDoctor) {
            res.status(400).json({ message: "Email is already registered" })
            return;
          }
          await sendOtpForSignup(otpRepository, email);
          res.status(200).json({ message: "OTP sent successfully" });
        } catch (error: any) {
          res.status(500).json({ message: error.message });
        }
    },

    // Verify OTP and register doctor
    verifyOtpAndRegisterUser: async (req: Request, res: Response) => {
        const { email, otp, fullName, mobileNumber, registerNumber, password } = req.body;

        const otpRepository = createOtpRepository();
        const doctorRepository = createDoctorRepository();

        try {
          const doctor = await verifyOtpAndRegisterDoc(
            otpRepository,
            doctorRepository,
            { email, otp, fullName, mobileNumber, registerNumber, password }
          );
          res.status(201).json({ message: "OTP verified and Doctor registered successfully, You can now log in and update profile..!", doctor });
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
    },

  // Doctor Login
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ message: "Email and Password are required" });
        return;
      }

      const doctorRepository = createDoctorRepository();

      const { token, refreshToken, role, doctor } = await loginDoctor(doctorRepository, { email, password });
      
      const userData = doctor._doc;

      // Store the refresh token in an HTTP-only cookie
      res.cookie("doctor_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });


      res.status(200).json({ message: "Login successful", token, refreshToken, role, userData });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  //Send OTP for forget Password
  sendOtpForForgetPassword: async (req: Request, res: Response): Promise<void> => {
    const {email} = req.body;
        
    const otpRepository = createOtpRepository();
    const doctorRepository = createDoctorRepository();

    try {
      const existingUser = await doctorRepository.findByEmail(email);
      if(!existingUser) {
        res.status(400).json({ message: "Please enter valid Email id" })
        return;
      }
      await sendOtpForResetPassword(otpRepository, email);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  //Verify the OTP and reset password verifyOtpAndResetDoctorPassword
  verifyAndResetPassword: async (req: Request, res: Response): Promise<void> => {
    const {email, newPassword, otp} = req.body;
    const otpRepository = createOtpRepository();
    const doctorRepository = createDoctorRepository();

    try {
      await verifyOtpAndResetDoctorPassword(
        otpRepository,
        doctorRepository,
        { email, newPassword, otp }
      );
      res.status(200).json({ message: "Password changed successfully, You can now log in..!"});
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    } 
  },


  //Update Doctor profile
  updateDoctorProfile: async (req: Request, res: Response): Promise<void> => {
    
    try {
      const { id } = req.params;      
      const updatedData = req.body;      
      
      const doctorRepository = createDoctorRepository();
      const updatedDocProfile = await updateDocProfile(doctorRepository, id, updatedData);        

      res.status(200).json({message: "User Profile Updated Successfully..!", updatedDocProfile});
      
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
  
      res.status(500).json({ message: "Failed to update profile", error: error.message }); 
      return;     
    }
  },
    
  getDashboardData: async (req: Request, res: Response): Promise<void> => {
    const { doctorId, startDate, endDate } = req.body;
    
    try {
      const appoinmentRepository = createAppointmentRepository();
      const stats = await GetDashboardStatsUseCase(
        appoinmentRepository, doctorId, new Date(startDate), new Date(endDate)
      )
      res.status(200).json(stats)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      res.status(500).json({ message: "Failed to fetch dashboard stats" })
    }
  }
};
