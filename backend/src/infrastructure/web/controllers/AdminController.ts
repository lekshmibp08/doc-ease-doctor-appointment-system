import { Request, Response, NextFunction} from "express";
import { createUserRepository } from "../../database/repositories/UserRepository";
import { loginAdmin } from "../../../application/useCases/admin/loginAdmin";
export const adminController = {
  // Admin Login
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
      const { adminToken, role } = await loginAdmin(userRepository, { email, password });

      res.cookie("auth_token", adminToken, { httpOnly: true, maxAge: 86400000 });
      res.status(200).json({ message: "Login successful", adminToken, role });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },







};
