import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticateUser = (allowedRoles: string[] = []): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
        
    if (!authHeader) {
      res.status(401).json({ message: "Authentication token is missing" });
      return;
    }
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token);
    //const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("2");      
      res.status(401).json({ message: "Authentication token is missing" });
      return;
    }

    try {
      console.log("3");

      const decodedToken = jwt.decode(token);
      console.log("DECODED TOKEN: ", decodedToken);
      
      //const decoded = jwt.verify(token, process.env.JWT_SECRET || "DocEaseSecret"  as string) as DecodedToken;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DocEaseSecret',) as DecodedToken;
      console.log(decoded);

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        console.log("4");
        
        res.status(403).json({ message: "You do not have the required permissions" });
        return;
      }

      // Attach user information to the request object
      //req.user = { id: decoded.id, role: decoded.role };

      next(); // Pass control to the next middleware or controller
    } catch (error: any) {
      console.log("5");
      if (error.name === 'TokenExpiredError') {
        console.error('Token has expired');
      } else {
        console.error('Token verification error:', error.message);
      }
      
      //res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
