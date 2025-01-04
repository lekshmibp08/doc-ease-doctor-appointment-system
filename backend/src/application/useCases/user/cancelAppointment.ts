import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export const cancelAppointmentByUserUsecase = async (
    appointmentId: string,
    appointmentRepository: IAppointmentRepository
): Promise<any> => {
  try {
    const appointment = await appointmentRepository.findAppointmentsById(appointmentId);
    if(!appointment) {
        throw new Error("Appointment not Found");
    }
    const updates = { isCancelled : true };
    const updatedAppointment = await appointmentRepository.updateAppointment(appointmentId, updates);
    return updatedAppointment?.isCancelled;
    
  } catch (error) {
    throw new Error("Failed to fetch appointments");
  }
};
