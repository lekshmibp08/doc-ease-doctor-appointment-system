import { AdminController } from "../../interfaces/controllers/adminController"; 
import { UserRepository } from "../database/repositories/userRepository";
import { DoctorRepository } from "../database/repositories/doctorRepository";
import { AdminDashboardRepository } from "../database/repositories/adminDashboardRepository";

import { LoginAdmin } from "../../application/useCases/implimentations/admin/loginAdminUseCase";
import { ListDoctorsUseCase } from "../../application/useCases/implimentations/admin/listDoctorsUseCase";
import { FetchPendingDoctors } from "../../application/useCases/implimentations/admin/fetchPendingDoctorsUseCase";
import { ListUsersUseCase } from "../../application/useCases/implimentations/admin/listUsersUseCase";
import { ApproveDoctorUsecase } from "../../application/useCases/implimentations/admin/approveDoctorUseCase";
import { RejectRequestUseCase } from "../../application/useCases/implimentations/admin/rejectRequestUseCase";
import { ToggleBlockDoctorUseCase } from "../../application/useCases/implimentations/admin/toggleBlockDoctorUseCase";
import { ToggleBlockUseruseCase } from "../../application/useCases/implimentations/admin/toggleBlockUserUseCase";
import { GetAdminDashboardStatsUseCase } from "../../application/useCases/implimentations/admin/getAdminDashboardStats";

export function createAdminController() {
  const userRepository = new UserRepository();
  const doctorRepository = new DoctorRepository();
  const adminDashboardRepository = new AdminDashboardRepository();

  const loginAdmin = new LoginAdmin(userRepository);
  const listDoctorsUseCase = new ListDoctorsUseCase(doctorRepository);
  const fetchPendingDoctors = new FetchPendingDoctors(doctorRepository);
  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const approveDoctorUsecase = new ApproveDoctorUsecase(doctorRepository);
  const rejectRequestUseCase = new RejectRequestUseCase(doctorRepository);
  const toggleBlockDoctorUseCase = new ToggleBlockDoctorUseCase(doctorRepository);
  const toggleBlockUseruseCase = new ToggleBlockUseruseCase(userRepository);
  const getAdminDashboardStatsUseCase = new GetAdminDashboardStatsUseCase(
    adminDashboardRepository
  );

  return new AdminController(
    loginAdmin,
    listDoctorsUseCase,
    fetchPendingDoctors,
    listUsersUseCase,
    approveDoctorUsecase,
    rejectRequestUseCase,
    toggleBlockDoctorUseCase,
    toggleBlockUseruseCase,
    getAdminDashboardStatsUseCase
  );
}
