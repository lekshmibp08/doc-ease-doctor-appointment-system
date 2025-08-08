import { NextFunction, Request, Response } from "express";
import { LoginAdmin } from "../../application/useCases/admin/loginAdminUseCase";
import { DoctorRepository } from "../../infrastructure/database/repositories/DoctorRepository";
import { ListDoctorsUseCase } from "../../application/useCases/admin/listDoctorsUseCase";
import { ListUsersUseCase } from "../../application/useCases/admin/listUsersUseCase";
import { ToggleBlockUseruseCase } from "../../application/useCases/admin/toggleBlockUserUseCase";
import { ToggleBlockDoctorUseCase } from "../../application/useCases/admin/toggleBlockDoctorUseCase";
import { FetchPendingDoctors } from "../../application/useCases/admin/fetchPendingDoctorsUseCase";
import { ApproveDoctorUsecase } from "../../application/useCases/admin/approveDoctorUseCase";
import { RejectRequestUseCase } from "../../application/useCases/admin/rejectRequestUseCase";
import { GetAdminDashboardStatsUseCase } from "../../application/useCases/admin/getAdminDashboardStats";
import { AdminDashboardRepository } from "../../infrastructure/database/repositories/AdminDashboardRepository";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";

const userRepository = new UserRepository();
const doctorRepository = new DoctorRepository();
const loginAdmin = new LoginAdmin(userRepository);
const listDoctorsUseCase = new ListDoctorsUseCase(doctorRepository);
const fetchPendingDoctors = new FetchPendingDoctors(doctorRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const approveDoctorUsecase = new ApproveDoctorUsecase(doctorRepository);
const rejectRequestUseCase = new RejectRequestUseCase(doctorRepository);
const toggleBlockDoctorUseCase = new ToggleBlockDoctorUseCase(doctorRepository);
const toggleBlockUseruseCase = new ToggleBlockUseruseCase(userRepository);
const adminDashboardRepository = new AdminDashboardRepository();
const getAdminDashboardStatsUseCase = new GetAdminDashboardStatsUseCase(
  adminDashboardRepository
);

export const adminController = {

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw { status: 400, message: "Email and Password are required" };
      }

      const { token, refreshToken, role } = await loginAdmin.execute({
        email,
        password,
      });

      res.cookie("admin_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ message: "Login successful", token, refreshToken, role });
    } catch (error: any) {
      next(error);
    }
  },

  // List all doctors
  getDoctors: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, size, search } = req.query;
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);
      const searchQuery = search ? String(search) : "";

      const { doctors, totalDoctors, totalPages } =
        await listDoctorsUseCase.execute(pageNumber, pageSize, searchQuery);

      res
        .status(200)
        .json({ doctors, totalDoctors, totalPages, currentPage: pageNumber });
    } catch (error: any) {
      next(error)
    }
  },

  //List all pending requests
  getPendingDoctors: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { page = 1, size = 8, search = "" } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(size as string);
    const searchQuery = search ? String(search) : "";

    try {
      const { doctors, totalDoctors, totalPages } =
        await fetchPendingDoctors.execute(pageNumber, pageSize, searchQuery);

      res
        .status(200)
        .json({ doctors, totalDoctors, totalPages, currentPage: pageNumber });
    } catch (error: any) {
      next(error)
    }
  },

  // List all users
  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, size, search } = req.query;
      console.log(req.query);

      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);
      const searchQuery = search ? String(search) : "";

      const { users, totalUsers, totalPages } = await listUsersUseCase.execute(
        pageNumber,
        pageSize,
        searchQuery
      );

      res
        .status(200)
        .json({ users, totalUsers, totalPages, currentPage: pageNumber });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to fetch users", error: error.message });
    }
  },

  //Handle Doctor Approval
  doctorApproval: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      await approveDoctorUsecase.execute(id);

      res.status(200).json({ message: "Doctor Approved Successfully..!" });
    } catch (error: any) {
      console.error("Error in doctor Approval:", error.message);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },

  //Handle Doctor Reject
  rejectDoctor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const reason = req.body.reason;

      const result = await rejectRequestUseCase.execute(id, reason);

      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },

  //Handle Block and unblock Doctor
  blockAndUnblockDoctor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await toggleBlockDoctorUseCase.execute(id);

      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },

  //Handle Block and unblock User
  blockAndUnblockUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await toggleBlockUseruseCase.execute(id);

      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },

  getAdminDashboardStats: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { startDate, endDate } = req.body;

      const stats = await getAdminDashboardStatsUseCase.execute(
        new Date(startDate),
        new Date(endDate)
      );

      res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch admin dashboard stats" });
    }
  },
};
