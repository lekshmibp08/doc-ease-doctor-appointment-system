import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository";

export const updateAppointmentReviewStatus = async (
    appointmentId: string,
    appointmentRepository: IAppointmentRepository,
    isReviewed: boolean
): Promise<any> => {
  try {
    const appointment = await appointmentRepository.findAppointmentsById(appointmentId);
    if(!appointment) {
        throw new Error("Appointment not Found");
    }
    const updates = { isReviewed : true };
    const updatedAppointment = await appointmentRepository.updateAppointment(appointmentId, updates);

    return updatedAppointment?.isReviewed;
    
  } catch (error) {
    throw new Error("Failed to fetch appointments");
  }
};
