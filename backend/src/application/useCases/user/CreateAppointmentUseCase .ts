import { IAppointment } from "../../../domain/entities/Appoinment";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";

interface IAppointmentInput {
  doctorId: string;
  userId: string;
  date: any;
  slotId: string;
  timeSlotId: string;
  time: string;
  modeOfVisit: "Video" | "Clinic";
  amount: number;
  paymentId: string;
}

export class CreateAppointmentUseCase {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private slotRepository: ISlotRepository
  ) {}

  async execute(appoinmentData: IAppointmentInput): Promise<IAppointment> {
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
