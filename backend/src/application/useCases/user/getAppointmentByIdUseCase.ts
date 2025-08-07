import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { mapToAppointmentWithDocDetailsDTO } from "../../../infrastructure/database/mappers/mapToAppointmentWithDocDetails";
import { AppointmentsByIdWithDocDetailsDTO } from "../../../dtos/dtos";
export class GetAppointmentsByIdUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(appointmentId: string): Promise<AppointmentsByIdWithDocDetailsDTO> {
    try {
      const appointment =
        await this.appointmentRepository.findAppointmentsByIdWithDocDetails(
          appointmentId
        );
      if (!appointment) {
        throw new Error("Appointment not found");
      }

      return mapToAppointmentWithDocDetailsDTO(appointment);
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch appointments");
    }
  }
}
