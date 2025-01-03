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

export const createAppointmentUseCase = async (
    appointmentRepository: IAppointmentRepository, 
    slotRepository: ISlotRepository,
    appoinmentData: IAppointmentInput,
): Promise<IAppointment> => {
    console.log("USECASE APP>DATA: ,", appoinmentData);
    
    const newAppoinment = await appointmentRepository.createAppointment(appoinmentData);
    if(!newAppoinment) {
        throw new Error("Failed to create appointment.");
    }
    
    await slotRepository.updateSlotStatus(
        appoinmentData.slotId,
        appoinmentData.timeSlotId,
        "Booked"
    )    
    return newAppoinment

} 