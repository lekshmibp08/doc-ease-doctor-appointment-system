import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export class CancelAppointmentByUserUsecase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(appointmentId: string): Promise<Partial<IAppointment>> {
    try {
      const appointment = await this.appointmentRepository.findAppointmentsById(
        appointmentId
      );
      if (!appointment) {
        throw new Error("Appointment not Found");
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
