import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export const updateAppointment = async (
    appointmentId: string,
    updates: Partial<IAppointment>,
    appointmentRepository: IAppointmentRepository,
): Promise<Partial<IAppointment>> => {
  try {
    const appointment = await appointmentRepository.findAppointmentsById(appointmentId);
    if(!appointment) {
        throw new Error("Appointment not Found");
    }
    const updatedAppointment = await appointmentRepository.updateAppointment(appointmentId, updates);
    
    return updatedAppointment;
    
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    throw new Error("Failed to fetch appointments.");
  }
};
