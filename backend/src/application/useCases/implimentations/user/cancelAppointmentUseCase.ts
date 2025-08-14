import { ICancelAppointmentByUserUseCase } from "../../interfaces/user/userUseCaseInterfaces";
import { IAppointmentRepository } from "../../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../../domain/entities/appoinment";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { AppError } from "../../../../shared/errors/appError";

export class CancelAppointmentByUserUsecase
  implements ICancelAppointmentByUserUseCase
{
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(appointmentId: string): Promise<Partial<IAppointment>> {
    try {
      const appointment = await this.appointmentRepository.findAppointmentsById(
        appointmentId
      );
      if (!appointment) {
        throw new AppError("Appointment not Found", HttpStatusCode.NOT_FOUND);
      }
      const updates = { isCancelled: true };
      const updatedAppointment =
        await this.appointmentRepository.updateAppointment(
          appointmentId,
          updates
        );

      return updatedAppointment;
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      throw new Error("Failed to fetch appointments.");
    }
  }
}
