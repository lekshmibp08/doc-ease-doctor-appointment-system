 
import { Request, Response } from "express";
//import { createUserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { loginAdmin } from "../../application/useCases/admin/loginAdmin";
import { createDoctorRepository } from "../../infrastructure/database/repositories/DoctorRepository";
import { listDoctors } from "../../application/useCases/admin/listDoctors";
import { listUsers } from "../../application/useCases/admin/listUsers";
import { toggleBlockUser } from "../../application/useCases/admin/toggleBlockUser";
import { toggleBlockDoctor } from "../../application/useCases/admin/toggleBlockDoctor";
import { fetchPendingDoctors } from "../../application/useCases/admin/fetchPendingDoctors";
import { approveDoctor } from "../../application/useCases/admin/approveDoctor";
import { rejectRequest } from "../../application/useCases/admin/rejectRequest";
import { GetAdminDashboardStatsUseCase } from "../../application/useCases/admin/getAdminDashboardStats";
import { AdminDashboardRepository } from "../../infrastructure/database/repositories/AdminDashboardRepository";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";

const userRepository = new UserRepository();

export const adminController = {
  // Admin Login
  
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw { status: 400, message: "Email and Password are required" };
        //res.status(400).json({ message: "Email and Password are required" });
        //return;
      }


      const { token, refreshToken, role } = await loginAdmin(userRepository, { email, password });

      // Store the refresh token in an HTTP-only cookie
      res.cookie("admin_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      res.status(200).json({ message: "Login successful", token, refreshToken, role });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  // List all doctors
  getDoctors: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, size, search } = req.query; 
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);
      const searchQuery = search ? String(search) : '';


      const doctorRepository = createDoctorRepository();
      const { doctors, totalDoctors, totalPages } = await listDoctors(doctorRepository, pageNumber, pageSize, searchQuery);

      res.status(200).json({ doctors, totalDoctors, totalPages, currentPage: pageNumber });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch doctors", error: error.message });
    }
  },

  //List all pending requests
  getPendingDoctors: async (req: Request, res: Response): Promise<void> => {
    const { page = 1, size = 8, search = "" } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(size as string);
    const searchQuery = search ? String(search) : '';

    try {
    const doctorRepository = createDoctorRepository();
    const { doctors, totalDoctors, totalPages } = await fetchPendingDoctors(doctorRepository, pageNumber, pageSize, searchQuery);
    
    res.status(200).json({ doctors, totalDoctors, totalPages, currentPage: pageNumber });

    
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch pending doctors", error: error.message });
    }
  },
  
  // List all users
  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, size, search } = req.query;
      console.log(req.query);
      
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(size as string);
      const searchQuery = search ? String(search) : '';

      const { users, totalUsers, totalPages } = await listUsers(userRepository, pageNumber, pageSize, searchQuery);

      res.status(200).json({ users, totalUsers, totalPages, currentPage: pageNumber });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  },

  //Handle Doctor Approval
  doctorApproval: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const doctorRepository = createDoctorRepository();

      await approveDoctor(doctorRepository, id);

      res.status(200).json({message: "Doctor Approved Successfully..!"});
      
    } catch (error: any) {
      console.error('Error in doctor Approval:', error.message);
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  },
  
  //Handle Doctor Reject
  rejectDoctor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const reason = req.body.reason;      
      
      const doctorRepository = createDoctorRepository();

      const result = await rejectRequest(doctorRepository, id, reason);

      res.status(200).json(result);
      
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  },

  //Handle Block and unblock Doctor
  blockAndUnblockDoctor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const doctorRepository = createDoctorRepository()

      const result = await toggleBlockDoctor(doctorRepository, id);

      res.status(200).json(result);
      
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  },


  //Handle Block and unblock User
  blockAndUnblockUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await toggleBlockUser(userRepository, id);

      res.status(200).json(result);
      
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  },

  getAdminDashboardStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.body;
      const adminDashboardRepository = new AdminDashboardRepository();
      const getAdminDashboardStatsUseCase = new GetAdminDashboardStatsUseCase(adminDashboardRepository);

      const stats = await getAdminDashboardStatsUseCase.execute(
        new Date(startDate), new Date(endDate)
      );

      res.status(200).json(stats);
      
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error)
      res.status(500).json({ message: "Failed to fetch admin dashboard stats" })
    }
  }

};
