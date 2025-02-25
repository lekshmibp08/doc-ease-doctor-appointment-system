import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export const getAppointmentsByUserUseCase = async (
  userId: string,
  appointmentRepository: IAppointmentRepository
): Promise<IAppointment[]> => {
  try {
    const appointments = await appointmentRepository.getAppointmentsByUserId(userId);    
    return appointments;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch appointments");
  }
};
