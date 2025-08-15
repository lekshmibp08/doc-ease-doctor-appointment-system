import { IAppointment } from "../../../../domain/entities/appoinment";
import { AppointmentInputDTO } from "../../../../dtos/dtos";
import { Doctor } from "../../../../domain/entities/doctor";
import { AppointmentsByIdWithDocDetailsDTO } from "../../../../dtos/dtos";
import { AppointmentsByUserIdDTO } from "../../../../dtos/dtos";
import { ListApprovedDoctorsDTO } from "../../../../dtos/doctorDTO/doctorDTOs";
import {
  ListApprovedDoctorsCriteriaDTO,
  VerifyOtpAndRegisterDTO,
  VerifyOtpAndResetPasswordDTO,
} from "../../../../dtos/useCaseDtos/userUseCaseDtos";
import { IUser } from "../../../../domain/entities/user";

export interface ICancelAppointmentByUserUseCase {
  execute(appointmentId: string): Promise<Partial<IAppointment>>;
}

export interface ICreateAppointmentUseCase {
  execute(
    appointmentData: AppointmentInputDTO
  ): Promise<Pick<IAppointment, "_id" | "date" | "time">>;
}

export interface IDoctorDetailsUseCase {
  execute(id: string): Promise<Partial<Doctor>>;
}

export interface IFetchSlotUseCase {
  execute(doctorId: string, date: any): Promise<any>;
}

export interface IFetchSpecializationsUseCase {
  execute(): Promise<any>;
}

export interface IGetAppointmentsByIdUseCase {
  execute(appointmentId: string): Promise<AppointmentsByIdWithDocDetailsDTO>;
}

export interface IGetAppointmentsByUserUseCase {
  execute(userId: string): Promise<AppointmentsByUserIdDTO>;
}

export interface IListApprovedDoctorsUseCase {
  execute(criteria: ListApprovedDoctorsCriteriaDTO): Promise<{
    doctors: ListApprovedDoctorsDTO[];
    totalPages: number;
  }>;
}

export interface IRescheduleAppointmentUseCase {
  execute(
    appointmentId: string,
    date: string,
    slotId: string,
    timeSlotId: string,
    time: string,
    modeOfVisit: "Video" | "Clinic"
  ): Promise<Partial<IAppointment>>;
}

export interface ISendOtpForResetPasswordUseCase {
  execute(email: string): Promise<void>;
}

export interface ISendOtpForSignupUseCase {
  execute(email: string): Promise<void>;
}

export interface IUpdateAppointment {
  execute(
    appointmentId: string,
    updates: Partial<IAppointment>
  ): Promise<Partial<IAppointment>>;
}

export interface IUpdateSlotStatus {
  execute(slotId: string, timeSlotId: string, status: string): Promise<void>;
}

export interface IUpdateUser {
  execute(id: string, updatedData: any): Promise<any>;
}

export interface IUserLoginUseCase {
  execute(data: { email: string; password: string }): Promise<{
    token: string;
    refreshToken: string;
    role: string;
    user: Record<string, any>;
  }>;
}

export interface IVerifyOtpAndRegisterUseCase {
  execute(data: VerifyOtpAndRegisterDTO): Promise<IUser>;
}

export interface IVerifyOtpAndResetPasswordUseCase {
  execute(data: VerifyOtpAndResetPasswordDTO): Promise<void>;
}
