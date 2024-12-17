import { Request, Response } from "express";
import { googleOAuthLogin } from "../../../application/useCases/auth/googleOAuthLogin";

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

  googleLogin: async (req: Request, res: Response): Promise<void> => {
    try {
      const { fullname, email, role, profilePicture } = req.body;      
      

      if (!email || !role) {
        res.status(400).json({ message: "Authentication failed" });
        return;
      }

      const { authToken, role: userRole, user } = await googleOAuthLogin(fullname, email, profilePicture, role);   

      //console.log("USER USER AUTH: ", user);
      const userData = user._doc;
      
      
      res.cookie("auth_token", authToken, { httpOnly: true, maxAge: 86400000 });
      res.status(200).json({ token: authToken, userData, role: userRole });

    } catch (error: any) {
      console.error("Google OAuth Error:", error);
      res.status(500).json({ message: error.message || "Google OAuth login failed" });
    }
  },
};
