import { IAppointment } from "../../../../domain/entities/appoinment";

export interface ICancelAppointmentByUserUseCase {
  execute(appointmentId: string): Promise<Partial<IAppointment>>;
}
