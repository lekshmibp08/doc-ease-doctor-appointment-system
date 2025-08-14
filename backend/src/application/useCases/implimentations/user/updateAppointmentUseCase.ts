import { IAppointmentRepository } from "../../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../../domain/entities/Appoinment";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/HttpStatusCode";

export class UpdateAppointment {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(
    appointmentId: string,
    updates: Partial<IAppointment>
  ): Promise<Partial<IAppointment>> {
    try {
      const appointment = await this.appointmentRepository.findAppointmentsById(
        appointmentId
      );
      if (!appointment) {
        throw new AppError("Appointment not Found", HttpStatusCode.NOT_FOUND);
      }
      const updatedAppointment =
        await this.appointmentRepository.updateAppointment(
          appointmentId,
          updates
        );

      return updatedAppointment;
    } catch (error: any) {
      throw new AppError(
        error.message || "Failed to fetch appointments.",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
