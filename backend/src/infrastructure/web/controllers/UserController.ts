import { Request, Response, NextFunction} from "express";
import { sendOtpForSignup } from "../../../application/useCases/user/sendOtpForSignup";
import { verifyOtpAndRegister } from "../../../application/useCases/user/verifyOtpAndRegisterUser";
import { createOtpRepository } from "../../database/repositories/OtpRepository";
import { createUserRepository } from "../../database/repositories/UserRepository";
import { createDoctorRepository } from "../../database/repositories/DoctorRepository";
import { loginUser } from "../../../application/useCases/user/loginUser";
import { listApprovedDoctors } from "../../../application/useCases/user/listApprovedDoctors";
import { updateUser } from "../../../application/useCases/user/updateUser";
import { sendOtpForResetPassword } from "../../../application/useCases/user/sendOtpForResetPassword";
import { verifyOtpAndResetPassword } from "../../../application/useCases/user/verifyOtpAndResetPassword";
import { doctorDetails } from "../../../application/useCases/user/doctorDetails";
import { fetchSpecializationsUseCase } from "../../../application/useCases/user/fetchSpecializationsUseCase";


export const userController = {
  // Send OTP during signup
  register: async (req: Request, res: Response) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords entered are not matching...!" });
      return;
    }
    
    const otpRepository = createOtpRepository();
    const userRepository = createUserRepository();

    try {
      // Check if the email already exists in the user database
      const existingUser = await userRepository.findByEmail(email);
      if(existingUser) {
        res.status(400).json({ message: "Email is already registered" })
        return;
      }
      await sendOtpForSignup(otpRepository, email);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Verify OTP and register user
  verifyOtpAndRegisterUser: async (req: Request, res: Response) => {
    const { email, otp, fullName, mobileNumber, password } = req.body;

    const otpRepository = createOtpRepository();
    const userRepository = createUserRepository();

    try {
      const user = await verifyOtpAndRegister(
        otpRepository,
        userRepository,
        { email, otp, fullName, mobileNumber, password }
      );
      res.status(201).json({ message: "OTP verified and User registered successfully, You can now log in..!", user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // User Login
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;      

      // Validate input
      if (!email || !password) {
        res.status(400).json({ message: "Email and Password are required" });
        return;
      }

      const userRepository = createUserRepository();      

      // Call the login use case
      const { token, refreshToken, role, user  } = await loginUser(userRepository, { email, password });

      const userData = user._doc;
      

      // Store the refresh token in an HTTP-only cookie
      res.cookie("user_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      console.log("Access Token:", token);
      console.log("Refresh Token Set in Cookie");

      res.status(200).json({ message: "Login successful", token, role, userData });
    
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  // List all approved doctors
  getDoctors: async (req: Request, res: Response) => {
    try {
      const { page = 1, size = 8, search, location, gender, experience, availability, fees, department, sort } = req.query;

      console.log(req.query);
      
  
      const doctorRepository = createDoctorRepository();

      const result = await listApprovedDoctors(doctorRepository, {
        page: Number(page),
        size: Number(size),
        search: search as string,
        location: location as string,
        gender: gender as string,
        experience: experience as string,
        availability: availability as string,
        fee: fees as string,
        department: department as string,
        sort: sort as string,
      });
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors", error });
    }
  },

  // List Specializations
  listSpecializations: async (req: Request, res: Response) => {
    try {
      const doctorRepository = createDoctorRepository();
      const specializations = await fetchSpecializationsUseCase(doctorRepository)
      console.log("[specializations controller]: -----> ", specializations);  
      res.json({ specializations });
      
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch specialization list", error });      
    }
  },

  // Update User profile
  updateUserProfile: async (req: Request, res: Response): Promise<void> => {
    console.log("ENTERED UPDATION");
    
    try {
      const { id } = req.params;
      const updatedData = req.body;
      
      const userRepository = createUserRepository();
      const updatedUser = await updateUser(userRepository, id, updatedData);      

      res.status(200).json({message: "User Profile Updated Successfully..!", updatedUser});
      
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
      return;     }
  },

  //Send OTP for forget Password
  sendOtpForForgetPassword: async (req: Request, res: Response): Promise<void> => {

    const {email} = req.body;
    
    console.log(email);
    
    const otpRepository = createOtpRepository();
    const userRepository = createUserRepository();

    try {
      const existingUser = await userRepository.findByEmail(email);
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

  //Verify the OTP and reset password
  verifyAndResetPassword: async (req: Request, res: Response) => {
    const {email, newPassword, otp} = req.body;
    const otpRepository = createOtpRepository();
    const userRepository = createUserRepository();

    try {
      const user = await verifyOtpAndResetPassword(
        otpRepository,
        userRepository,
        { email, newPassword, otp }
      );
      res.status(200).json({ message: "Password changed successfully, You can now log in..!"});
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }    
  },

  // Get doctor Details
  getDoctorDetails: async (req: Request, res: Response) => {
    const { id } = req.params;
    const doctorRepository = createDoctorRepository();
    try {
      const details = await doctorDetails( doctorRepository, id )
      res.status(200).json(details);
      
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  


};
