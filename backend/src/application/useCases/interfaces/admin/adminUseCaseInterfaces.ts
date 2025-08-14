import {
  AppointmentByAdminDTO,
  DoctorListDTO,
  GetAdminDashboardStatsOutputDTO,
  ToggleBlockDoctorOutputDTO,
  ToggleBlockUserOutputDTO,
} from "../../../dto/adminUseCaseDtos";

export interface IApproveDoctorUsecase {
  execute(id: string): Promise<void>;
}

export interface IFetchPendingDoctorsUsecase {
  execute(
    page: number,
    size: number,
    search: string
  ): Promise<{
    doctors: Array<{
      _id: string;
      fullName: string;
      isApproved: boolean;
      isBlocked: boolean;
      registerNumber: string;
      isRejected?: boolean;
      documents: string[];
    }>;
    totalDoctors: number;
    totalPages: number;
  }>;
}

export interface IGetAdminDashboardStatsUseCase {
  execute(
    startDate: Date,
    endDate: Date
  ): Promise<GetAdminDashboardStatsOutputDTO>;
}

export interface IListAllAppointmentsForAdmin {
  execute(
    page: number,
    size: number,
    searchQuery: string
  ): Promise<{
    appointments: AppointmentByAdminDTO[];
    totalAppointments: number;
    totalPages: number;
  }>;
}

export interface IListDoctorsUseCase {
  execute(
    page: number,
    size: number,
    search: string
  ): Promise<{
    doctors: DoctorListDTO[];
    totalDoctors: number;
    totalPages: number;
  }>;
}

export interface IListUsersUseCase {
  execute(
    page: number,
    size: number,
    search: string
  ): Promise<{
    users: any;
    totalUsers: number;
    totalPages: number;
  }>;
}

export interface ILoginAdmin {
  execute(data: {
    email: string;
    password: string;
  }): Promise<{ token: string; refreshToken: string; role: string }>
}

export interface IRejectRequestUseCase {
  execute(id: string, reason: string): Promise<void>
}

export interface IToggleBlockDoctorUseCase {
  execute(id: string): Promise<ToggleBlockDoctorOutputDTO>;
}

export interface IToggleBlockUseruseCase {
  execute(id: string): Promise<ToggleBlockUserOutputDTO>;
}