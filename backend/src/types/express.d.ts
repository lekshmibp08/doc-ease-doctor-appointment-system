
declare global {
  namespace Express {
    interface User {
      id: string;
      role: string; 
    }

    interface Request {
      user?: User; // Update the Request interface
    }
  }
}