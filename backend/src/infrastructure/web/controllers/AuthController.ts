import { Request, Response } from "express";

export const authController = {
  // Logout for all roles (User, Doctor, Admin)
  logout: (req: Request, res: Response): void => {
    try {
      console.log("BACKEND LOGOUT");
      
      // Clear the auth token cookie
      res.clearCookie("auth_token", { httpOnly: true });
      res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
      res.status(500).json({ message: "Error during logout", error: error.message });
    }
  },
};
