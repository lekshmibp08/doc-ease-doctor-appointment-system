import { Request, Response, NextFunction } from "express";
import { ErrorLogModel } from "../../infrastructure/database/models/ErrorLogModel";

interface CustomError extends Error {
  status?: number;
}

// 404 Not Found Middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: "API route not found" });
};

// Global Error Handling Middleware
export const errorHandler = async (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  try {
    await ErrorLogModel.create({
      message: err.message,
      stack: err.stack,
      statusCode,
      path: req.originalUrl,
      method: req.method,
    });
  } catch (dbError) {
    console.error("Failed to log error to database:", dbError);
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
