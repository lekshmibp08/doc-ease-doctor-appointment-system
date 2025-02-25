import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export const getAppointmentsByIdUseCase = async (
  appointmentId: string,
  appointmentRepository: IAppointmentRepository
): Promise<any> => {
  try {
    const appointment = await appointmentRepository.findAppointmentsByIdWithDocDetails(appointmentId);
    
    return appointment;
  } catch (error) {
    throw new Error("Failed to fetch appointments");
  }
};
