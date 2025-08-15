export interface GetAdminDashboardStatsInputDTO {
  startDate: Date;
  endDate: Date;
}

export interface RevenueChartDataDTO {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export interface TopDoctorByAppointmentsDTO {
  name: string;
  appointments: number;
}

export interface TopRatedDoctorDTO {
  name: string;
  rating: number;
}

export interface GetAdminDashboardStatsOutputDTO {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  totalAmountReceived: number;
  totalRevenue: number;
  revenueData: RevenueChartDataDTO;
  topDoctorsByAppointments: TopDoctorByAppointmentsDTO[];
  topRatedDoctors: TopRatedDoctorDTO[];
}

export interface AppointmentByAdminDTO {
  _id: string;
  user: {
    fullName: string;
  };
  doctor: {
    fullName: string;
  };
  date: string;
  time: string;
  isCompleted: boolean;
}

export interface DoctorListDTO {
  _id: string;
  fullName: string;
  email: string;
  isApproved: boolean;
  isBlocked: boolean;
  mobileNumber: string;
  registerNumber: string;
}

export interface ListUsersUseCaseDTO {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  isBlocked: boolean;
}

export interface ToggleBlockDoctorOutputDTO {
  isBlocked: boolean;
  message: string;
}

export interface ToggleBlockUserOutputDTO {
  isBlocked: boolean;
  message: string;
}
