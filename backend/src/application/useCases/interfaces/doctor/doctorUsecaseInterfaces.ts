import { IAppointment } from "../../../../domain/entities/appoinment";
import { Doctor } from "../../../../domain/entities/doctor";
import { AppointmentsByDocIdDTO } from "../../../../dtos/dtos"; 
import { DashboardStatsDTO, RegisterDoctorDTO } from "../../../../dtos/useCaseDtos/doctorUseCaseDtos";

// ---------------- GetAppointmentsByDoctorId ----------------
export interface IGetAppointmentsByDoctorIdUseCase {
  execute(
    doctorId: string,
    date: string,
    page: number,
    size: number
  ): Promise<{
    appointments: AppointmentsByDocIdDTO[];
    totalAppointments: number;
    totalPages: number;
  }>;
}

// ---------------- LoginDoctor ----------------
export interface ILoginDoctorUseCase {
  execute(data: { email: string; password: string }): Promise<{
    token: string;
    refreshToken: string;
    role: string;
    doctor: Record<string, any>;
  }>;
}

// ---------------- VerifyOtpAndRegisterDoc ----------------
export interface IVerifyOtpAndRegisterDocUseCase {
  execute(data: RegisterDoctorDTO): Promise<Doctor>;
}

// ---------------- UpdateSlot ----------------
export interface IUpdateSlotUseCase {
  execute(
    slotId: string,
    timeSlotId: string,
    status: string
  ): Promise<{ success: boolean }>;
}

// ---------------- UpdateSlotTime ----------------
export interface IUpdateSlotTimeUseCase {
  execute(
    slotId: string,
    timeSlotId: string,
    newTime: string
  ): Promise<any>;
}

// ---------------- UpdateDocProfile ----------------
export interface IUpdateDocProfileUseCase {
  execute(
    doctorId: string,
    profileData: Record<string, any>
  ): Promise<{ success: boolean }>;
}

// ---------------- UpdateAppointment ----------------
export interface IUpdateAppointmentUseCase {
  execute(
    appointmentId: string,
    isCompleted: boolean
  ): Promise<IAppointment>;
}

// ---------------- GetDashboardStats ----------------
export interface IGetDashboardStatsUseCase {
  execute(
    doctorId: string,
    startDate: Date,
    endDate: Date
): Promise<DashboardStatsDTO>;
}

// ---------------- VerifyOtpAndResetDoctorPassword ----------------
export interface IVerifyOtpAndResetDoctorPasswordUseCase {
  execute(data: { email: string; otp: string; newPassword: string }): Promise<void>;
}

// ------------------- FindExistingDoctor -------------------
export interface IFindExistingDoctorUseCase {
  execute(email: string): any
}