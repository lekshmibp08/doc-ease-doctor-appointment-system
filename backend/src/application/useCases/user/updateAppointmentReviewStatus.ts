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
    const updates = { isReviewed : isReviewed };
    const updatedAppointment = await appointmentRepository.updateAppointment(appointmentId, updates);

    return updatedAppointment?.isReviewed;
    
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch appointments");
  }
};
