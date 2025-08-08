import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/appError";

export class RescheduleAppointmentUseCase {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private slotRepository: ISlotRepository
  ) {}

  async execute(
    appointmentId: string,
    date: string,
    slotId: string,
    timeSlotId: string,
    time: string,
    modeOfVisit: "Video" | "Clinic"
  ) {
    const appointment = await this.appointmentRepository.findAppointmentsById(
      appointmentId
    );
    if (!appointment) {
      throw new AppError("Appointment not found", HttpStatusCode.NOT_FOUND);
    }

    const previousSlotId = appointment.slotId.toString();
    const previousTimeSlotId = appointment.timeSlotId.toString();

    await this.slotRepository.updateSlotStatus(
      previousSlotId,
      previousTimeSlotId,
      "Not Booked"
    );

    const updates = {
      date: new Date(date),
      slotId,
      timeSlotId,
      time,
      modeOfVisit,
    };

    const updatedAppointment =
      await this.appointmentRepository.updateAppointment(
        appointmentId,
        updates
      );

    await this.slotRepository.updateSlotStatus(slotId, timeSlotId, "Booked");

    return updatedAppointment;
  }
}
