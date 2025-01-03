import { IAppointment } from "../entities/Appoinment";

export interface IAppointmentRepository {
    createAppointment(appointmentData: IAppointment): Promise<IAppointment>;
}