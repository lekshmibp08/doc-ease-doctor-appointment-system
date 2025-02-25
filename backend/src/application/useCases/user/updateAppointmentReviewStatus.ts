import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";

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
