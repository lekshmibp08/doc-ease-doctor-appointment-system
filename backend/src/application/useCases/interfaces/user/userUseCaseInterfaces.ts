import { IAppointment } from "../../../../domain/entities/appoinment";
import { AppointmentInputDTO } from "../../../../dtos/dtos";

export interface ICancelAppointmentByUserUseCase {
  execute(appointmentId: string): Promise<Partial<IAppointment>>;
}


export interface ICreateAppointmentUseCase {
  execute(
    appointmentData: AppointmentInputDTO
  ): Promise<Pick<IAppointment, "_id" | "date" | "time">>;
}
