import { IAppointment } from "../../../domain/entities/Appoinment";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { AppointmentInputDTO } from "../../../dtos/dtos";


export class CreateAppointmentUseCase {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private slotRepository: ISlotRepository
  ) {}

  async execute(appoinmentData: AppointmentInputDTO): Promise<IAppointment> {
    const newAppoinment = await this.appointmentRepository.createAppointment(
      appoinmentData
    );
    if (!newAppoinment) {
      throw new Error("Failed to create appointment.");
    }

    await this.slotRepository.updateSlotStatus(
      appoinmentData.slotId,
      appoinmentData.timeSlotId,
      "Booked"
    );
    return newAppoinment;
  }
}
