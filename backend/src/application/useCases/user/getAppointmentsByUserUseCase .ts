import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export class GetAppointmentsByUserUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(userId: string): Promise<IAppointment[]> {
    try {
      const appointments =
        await this.appointmentRepository.getAppointmentsByUserId(userId);
      return appointments;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch appointments");
    }
  }
}
