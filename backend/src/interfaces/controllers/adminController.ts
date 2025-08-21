import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../enums/httpStatusCode";
import { LoginAdmin } from "../../application/useCases/implimentations/admin/loginAdminUseCase";
import { ListDoctorsUseCase } from "../../application/useCases/implimentations/admin/listDoctorsUseCase";
import { ListUsersUseCase } from "../../application/useCases/implimentations/admin/listUsersUseCase";
import { ToggleBlockUseruseCase } from "../../application/useCases/implimentations/admin/toggleBlockUserUseCase";
import { ToggleBlockDoctorUseCase } from "../../application/useCases/implimentations/admin/toggleBlockDoctorUseCase";
import { FetchPendingDoctors } from "../../application/useCases/implimentations/admin/fetchPendingDoctorsUseCase";
import { ApproveDoctorUsecase } from "../../application/useCases/implimentations/admin/approveDoctorUseCase";
import { RejectRequestUseCase } from "../../application/useCases/implimentations/admin/rejectRequestUseCase";
import { GetAdminDashboardStatsUseCase } from "../../application/useCases/implimentations/admin/getAdminDashboardStats";

export class AdminController {
  constructor(
    private loginAdmin: LoginAdmin,
    private listDoctorsUseCase: ListDoctorsUseCase,
    private fetchPendingDoctors: FetchPendingDoctors,
    private listUsersUseCase: ListUsersUseCase,
    private approveDoctorUsecase: ApproveDoctorUsecase,
    private rejectRequestUseCase: RejectRequestUseCase,
    private toggleBlockDoctorUseCase: ToggleBlockDoctorUseCase,
    private toggleBlockUseruseCase: ToggleBlockUseruseCase,
    private getAdminDashboardStatsUseCase: GetAdminDashboardStatsUseCase
  ) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Email and Password are required",
        };
      }

      const { token, refreshToken, role } = await this.loginAdmin.execute({
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
        .status(HttpStatusCode.OK)
        .json({ message: "Login successful", token, refreshToken, role });
    } catch (error) {
      next(error);
    }
  };

  getDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, size, search } = req.query;
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);
      const searchQuery = search ? String(search) : "";

      const { doctors, totalDoctors, totalPages } =
        await this.listDoctorsUseCase.execute(pageNumber, pageSize, searchQuery);

      res.status(HttpStatusCode.OK).json({
        doctors,
        totalDoctors,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error) {
      next(error);
    }
  };

  getPendingDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, size = 8, search = "" } = req.query;
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);
      const searchQuery = String(search);

      const { doctors, totalDoctors, totalPages } =
        await this.fetchPendingDoctors.execute(pageNumber, pageSize, searchQuery);

      res.status(HttpStatusCode.OK).json({
        doctors,
        totalDoctors,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, size, search } = req.query;
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);
      const searchQuery = search ? String(search) : "";

      const { users, totalUsers, totalPages } =
        await this.listUsersUseCase.execute(pageNumber, pageSize, searchQuery);

      res.status(HttpStatusCode.OK).json({
        users,
        totalUsers,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error) {
      next(error);
    }
  };

  doctorApproval = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.approveDoctorUsecase.execute(req.params.id);
      res
        .status(HttpStatusCode.OK)
        .json({ message: "Doctor Approved Successfully..!" });
    } catch (error) {
      next(error);
    }
  };

  rejectDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.rejectRequestUseCase.execute(
        req.params.id,
        req.body.reason
      );
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  blockAndUnblockDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.toggleBlockDoctorUseCase.execute(req.params.id);
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  blockAndUnblockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.toggleBlockUseruseCase.execute(req.params.id);
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAdminDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.body;
      const stats = await this.getAdminDashboardStatsUseCase.execute(
        new Date(startDate),
        new Date(endDate)
      );
      res.status(HttpStatusCode.OK).json(stats);
    } catch (error) {
      next(error);
    }
  };
}
