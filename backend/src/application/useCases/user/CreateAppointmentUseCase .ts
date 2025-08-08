import { IAppointment } from "../../../domain/entities/Appoinment";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { AppointmentInputDTO } from "../../../dtos/dtos";
import { AppError } from "../../../shared/errors/appError";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";

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
      throw new AppError(
        "Failed to create appointment.",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    await this.slotRepository.updateSlotStatus(
      appoinmentData.slotId,
      appoinmentData.timeSlotId,
      "Booked"
    );
    return newAppoinment;
  }
}
