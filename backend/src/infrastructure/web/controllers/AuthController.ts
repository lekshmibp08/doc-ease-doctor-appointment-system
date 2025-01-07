import { Request, Response } from "express";
import { googleOAuthLogin } from "../../../application/useCases/auth/googleOAuthLogin";
import jwt from "jsonwebtoken";


export const authController = {
  // Logout for all roles (User, Doctor, Admin)
  logout: (req: Request, res: Response): void => {
    try {
      console.log("BACKEND LOGOUT");
      
      // Clear the auth token cookie
      res.clearCookie("refresh_token", { httpOnly: true });
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

  refreshAccessToken: async (req: Request, res: Response): Promise<any> => {
    console.log("Cookies received:", req.cookies);
    console.log("Request Headers:", req.headers);

    //const { refresh_token } = req.cookies;
    const { role } = req.body;
    console.log(req.body);
    
    console.log("ROLE: ", role);

      // Get the refresh token for the appropriate role from the cookies
      let refresh_token;
      if (role === 'user') {
        refresh_token = req.cookies['user_refresh_token'];  // For user
      } else if (role === 'doctor') {
        refresh_token = req.cookies['doctor_refresh_token'];  // For doctor
      } else if (role === 'admin') {
        refresh_token = req.cookies['admin_refresh_token'];  // For admin
      } else {
        return res.status(400).json({ message: "Invalid role" });
      }
    

  
    if (!refresh_token) {
      return res.status(403).json({ message: "Refresh token not found" });
    }
  
    try {
      const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload;
      console.log("DECODED FOR REFRESH: ", decoded);
      
  
      // Use decoded token properties directly
      const { id, email, role } = decoded;
  
      if (!id || !email || !role) {
        throw new Error("Invalid token payload");
      }
  
      const newAccessToken = jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" } 
      );
  
      return res.status(200).json({ token: newAccessToken });
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
  },


  

};
