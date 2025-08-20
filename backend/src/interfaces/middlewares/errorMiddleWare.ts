import { Request, Response } from "express";
import { ErrorLogModel } from "../../infrastructure/database/models/errorLogModel";
import { AppError } from "../../shared/errors/appError";
import { HttpStatusCode } from "../../enums/httpStatusCode";

// 404 Not Found Middleware
export const notFound = (req: Request, res: Response) => {
  res
    .status(HttpStatusCode.NOT_FOUND)
    .json({ success: false, message: "API route not found" });
};

// Global Error Handling Middleware
export const errorHandler = async (
  err: AppError,
  req: Request,
  res: Response,
  next: Function
) => {
  const statusCode = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
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
