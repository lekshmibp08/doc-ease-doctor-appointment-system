import { Request, Response, NextFunction} from "express";
import { createOtpRepository } from "../../database/repositories/OtpRepository"; 
import { createDoctorRepository } from "../../database/repositories/DoctorRepository";
import { sendOtpForSignup } from "../../../application/useCases/user/sendOtpForSignup";
import { verifyOtpAndRegisterDoc } from "../../../application/useCases/doctor/verifyOtpAndRegisterDoc";
import { loginDoctor } from "../../../application/useCases/doctor/loginDoctor";
import { sendOtpForResetPassword } from "../../../application/useCases/user/sendOtpForResetPassword";
import { verifyOtpAndResetDoctorPassword } from "../../../application/useCases/doctor/verifyOtpAndResetDoctorPassword";
import { updateDocProfile } from "../../../application/useCases/doctor/updateDocProfile";

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

      console.log("Req body Backend: ", email);
      

      if (!email || !password) {
        res.status(400).json({ message: "Email and Password are required" });
        return;
      }

      const doctorRepository = createDoctorRepository();

      const { docToken, role, doctor } = await loginDoctor(doctorRepository, { email, password });
      
      const userData = doctor._doc;

      res.cookie("auth_token", docToken, { httpOnly: true, maxAge: 86400000 })
      .status(200).json({ message: "Login successful", docToken, role, userData });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  //Send OTP for forget Password
  sendOtpForForgetPassword: async (req: Request, res: Response): Promise<void> => {
    const {email} = req.body;
    
    console.log(email);
    
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
      const user = await verifyOtpAndResetDoctorPassword(
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
      console.log("ENTERED UPDATION");
      
      try {
        const { id } = req.params;
        console.log("PARAMS: ", id);
        
        const updatedData = req.body;
        
        const doctorRepository = createDoctorRepository();
        const updatedDocProfile = await updateDocProfile(doctorRepository, id, updatedData);  
        
        console.log("CONTROLLER UPDATED DOC: ", updatedDocProfile);
        
  
        res.status(200).json({message: "User Profile Updated Successfully..!", updatedDocProfile});
        
      } catch (error: any) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
      }
    },


};
