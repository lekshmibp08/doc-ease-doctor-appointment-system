import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { AppointmentsByUserIdDTO } from "../../../dtos/dtos";
import { mapToAppointmentsByUserDTO } from "../../../infrastructure/database/mappers/mapToAppointmentsByUserDTO";

export class GetAppointmentsByUserUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(userId: string): Promise<AppointmentsByUserIdDTO> {
    try {
      const appointments =
        await this.appointmentRepository.getAppointmentsByUserId(userId);
      return appointments.map(mapToAppointmentsByUserDTO);
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch appointments");
    }
  }
}
