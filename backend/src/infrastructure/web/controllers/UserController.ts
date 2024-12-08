import { Request, Response, NextFunction} from "express";
import { sendOtpForSignup } from "../../../application/useCases/user/sendOtpForSignup";
import { verifyOtpAndRegister } from "../../../application/useCases/user/verifyOtpAndRegisterUser";
import { createOtpRepository } from "../../database/repositories/OtpRepository";
import { createUserRepository } from "../../database/repositories/UserRepository";

export const userController = {
  // Send OTP during signup
  register: async (req: Request, res: Response, next: NextFunction) => {
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
  }
};
