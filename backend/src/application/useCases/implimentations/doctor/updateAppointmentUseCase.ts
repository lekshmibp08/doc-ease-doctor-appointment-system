import { IUpdateAppointmentUseCase } from "../../interfaces/doctor/doctorUsecaseInterfaces";
import { IAppointmentRepository } from "../../../../domain/repositories/IAppointmentRepository";

export class UpdateAppointmentUseCase implements IUpdateAppointmentUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(appointmentId: string, isCompleted: boolean) {
    const updates = { isCompleted: isCompleted };

    const updatedAppointment =
      await this.appointmentRepository.updateAppointment(
        appointmentId,
        updates
      );

    return updatedAppointment;
  }
}
