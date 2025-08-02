/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

// 404 Not Found Middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: "API route not found" });
};

// Global Error Handling Middleware
export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
