import { IAppointment } from "../entities/Appoinment";

export interface IAppointmentRepository {
    createAppointment(appointmentData: IAppointment): Promise<IAppointment>;
    
    getAppointmentsByUserId(userId: string): Promise<IAppointment[]>;
    
    findAppointmentsById(appointmentId: string): Promise<IAppointment | null>;
    
    updateAppointment(appointmentId: string, updates: Partial<IAppointment>):
        Promise<IAppointment | null>;

    
}