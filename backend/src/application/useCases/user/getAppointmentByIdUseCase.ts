import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";

export class GetAppointmentsByIdUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(appointmentId: string): Promise<any> {
    try {
      const appointment =
        await this.appointmentRepository.findAppointmentsByIdWithDocDetails(
          appointmentId
        );

      return appointment;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch appointments");
    }
  }
}
