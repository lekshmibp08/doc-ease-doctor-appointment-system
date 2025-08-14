import { ICreateAppointmentUseCase } from "../../interfaces/user/userUseCaseInterfaces";
import { IAppointment } from "../../../../domain/entities/appoinment";
import { IAppointmentRepository } from "../../../../domain/repositories/IAppointmentRepository";
import { ISlotRepository } from "../../../../domain/repositories/ISlotRepository";
import { AppointmentInputDTO } from "../../../../dtos/dtos";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";

export class CreateAppointmentUseCase implements ICreateAppointmentUseCase {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private slotRepository: ISlotRepository
  ) {}

  async execute(appoinmentData: AppointmentInputDTO): Promise <Pick<IAppointment, "_id" | "date" | "time">> {
    const newAppoinmentDoc = await this.appointmentRepository.createAppointment(
      appoinmentData
    );
    if (!newAppoinmentDoc) {
      throw new AppError(
        "Failed to create appointment.",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    const newAppoinment = {
      _id: newAppoinmentDoc._id,
      date: newAppoinmentDoc.date,
      time: newAppoinmentDoc.time
    }



    await this.slotRepository.updateSlotStatus(
      appoinmentData.slotId,
      appoinmentData.timeSlotId,
      "Booked"
    );
    return newAppoinment;
  }
}
