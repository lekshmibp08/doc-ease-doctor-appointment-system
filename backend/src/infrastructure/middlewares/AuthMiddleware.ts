import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { createUserRepository } from "../database/repositories/UserRepository";
import { createDoctorRepository } from "../database/repositories/DoctorRepository";


interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticateUser = (allowedRoles: string[] = []): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
        
    if (!authHeader) {
      res.status(401).json({ message: "Authentication token is missing" });
      return;
    }
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token);
    //const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Authentication token is missing" });
      return;
    }

    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DocEaseSecret',) as DecodedToken;

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                
        res.status(403).json({ message: "You do not have the required permissions" });
        return;
      }

      const userRepository = createUserRepository();
      const doctorRepository = createDoctorRepository();

      let user;
      if(decoded.role === 'user' || decoded.role === "admin") {
        user = await userRepository.findUserById(decoded.id);
      } else if (decoded.role === "doctor") {
        user = await doctorRepository.findDoctorById(decoded.id);
      }

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.isBlocked) {
        res.status(403).json({ message: "Your account is blocked. Please contact support." });
        return;
      }

      // Attach user information to the request object
      //req.user = { id: decoded.id, role: decoded.role };

      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        console.error('Token has expired');
      } else {
        console.error('Token verification error:', error.message);
      }
      
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
