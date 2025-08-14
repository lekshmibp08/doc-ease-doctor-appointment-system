export interface AppointmentChartData {
  labels: string[];
  datasets: {
    label: string;
    data: any[];
  }[];
}

export interface RevenueChartData {
  labels: string[];
  datasets: {
    label: string;
    data: any[];
  }[];
}

export interface DashboardStatsDTO {
  totalPatients: number;
  totalAppointments: number;
  totalConsultations: number;
  totalRevenue: number;
  appointmentData: AppointmentChartData;
  revenueData: RevenueChartData;
}

export interface RegisterDoctorDTO {
  email: string;
  otp: string;
  fullName: string;
  mobileNumber: string;
  registerNumber: string;
  password: string;
}
