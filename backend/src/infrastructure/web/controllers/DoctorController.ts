import { Request, Response, NextFunction} from "express";
import { createOtpRepository } from "../../database/repositories/OtpRepository"; 
import { createDoctorRepository } from "../../database/repositories/DoctorRepository";
import { sendOtpForSignup } from "../../../application/useCases/user/sendOtpForSignup";

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


};
