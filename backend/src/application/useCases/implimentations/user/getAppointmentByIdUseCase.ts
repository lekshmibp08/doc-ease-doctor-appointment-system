import { IAppointmentRepository } from "../../../../domain/repositories/IAppointmentRepository";
import { mapToAppointmentWithDocDetailsDTO } from "../../../../infrastructure/database/mappers/mapToAppointmentWithDocDetails";
import { AppointmentsByIdWithDocDetailsDTO } from "../../../../dtos/dtos";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
export class GetAppointmentsByIdUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(
    appointmentId: string
  ): Promise<AppointmentsByIdWithDocDetailsDTO> {
    try {
      const appointment =
        await this.appointmentRepository.findAppointmentsByIdWithDocDetails(
          appointmentId
        );
      if (!appointment) {
        throw new AppError("Appointment not found", HttpStatusCode.NOT_FOUND);
      }

      return mapToAppointmentWithDocDetailsDTO(appointment);
    } catch (error: any) {
      throw new AppError(
        error.message || "Failed to fetch appointments",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
