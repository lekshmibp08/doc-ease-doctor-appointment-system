import { Request, Response, NextFunction} from "express";
import { createUserRepository } from "../../database/repositories/UserRepository";
import { loginAdmin } from "../../../application/useCases/admin/loginAdmin";
import { createDoctorRepository } from "../../database/repositories/DoctorRepository";
import { listDoctors } from "../../../application/useCases/admin/listDoctors";
import { listUsers } from "../../../application/useCases/admin/listUsers";
import { toggleApproval } from "../../../application/useCases/admin/toggleDoctorApproval";



export const adminController = {
  // Admin Login
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and Password are required" });
        return;
      }

      const userRepository = createUserRepository();

      const { adminToken, role } = await loginAdmin(userRepository, { email, password });

      res.cookie("auth_token", adminToken, { httpOnly: true, maxAge: 86400000 });
      res.status(200).json({ message: "Login successful", adminToken, role });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  // List all doctors
  getDoctors: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, size, search } = req.query; // default to page 1 and size 10
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
  
  // List all users
  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const userRepository = createUserRepository();
      const users = await listUsers(userRepository);

      res.status(200).json({ users });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  },

  //Handle Doctor Approval
  doctorApproval: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const doctorRepository = createDoctorRepository();

      const result = await toggleApproval(doctorRepository, id);

      res.status(200).json(result);
      
    } catch (error: any) {
      console.error('Error toggling doctor block status:', error.message);
      res.status(500).json({ message: error.message || 'Internal server error' });

    }
  }





};
