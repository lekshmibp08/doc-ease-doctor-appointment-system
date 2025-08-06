import { IAppointment } from "../entities/Appoinment";
import { AppointmentInputDTO } from "../../dtos/dtos";

export interface IAppointmentRepository {
    createAppointment(appointmentData: AppointmentInputDTO): Promise<IAppointment>;
    
    getAppointmentsByUserId(userId: string): Promise<any>;
    
    findAppointmentsById(appointmentId: string): Promise<IAppointment | null>;
    
    findAppointmentsByIdWithDocDetails(appointmentId: string): Promise<IAppointment | null>;

    updateAppointment(appointmentId: string, updates: Partial<IAppointment>):
        Promise<IAppointment>;
    
    getAppointmentsWithPagination: (skip: number, limit: number, searchQuery: any) =>
        Promise<IAppointment[]>;

    countAppointments: (query: any) => Promise<number>;

    getAppointmentsByDoctorId: (filter: any, skip: number, limit: number) =>
        Promise<{ appointments: any; totalAppointments: number }>

    findByDoctorIdAndDateRange: (doctorId: string, startDate: Date, endDate: Date) =>
        Promise<IAppointment[]>

    
}