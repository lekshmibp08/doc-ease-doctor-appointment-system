import { IAppointment } from "../entities/Appoinment";

export interface IAppointmentRepository {
    createAppointment(appointmentData: IAppointment): Promise<IAppointment>;
    
    getAppointmentsByUserId(userId: string): Promise<IAppointment[]>;
    
    findAppointmentsById(appointmentId: string): Promise<IAppointment | null>;
    
    findAppointmentsByIdWithDocDetails(appointmentId: string): Promise<IAppointment | null>;

    updateAppointment(appointmentId: string, updates: Partial<IAppointment>):
        Promise<IAppointment | null>;
    
    getAppointmentsWithPagination: (skip: number, limit: number, searchQuery: any) =>
        Promise<IAppointment[]>;

    countAppointments: (query: any) => Promise<number>;

    getAppointmentsByDoctorId: (filter: any, skip: number, limit: number) =>
        Promise<{ appointments: IAppointment[]; totalAppointments: number }>

    
}