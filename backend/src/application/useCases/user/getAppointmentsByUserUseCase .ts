import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IAppointment } from "../../../domain/entities/Appoinment";

export const getAppointmentsByUserUseCase = async (
  userId: string,
  appointmentRepository: IAppointmentRepository
): Promise<IAppointment[]> => {
  try {
    const appointments = await appointmentRepository.getAppointmentsByUserId(userId);    
    return appointments;
  } catch (error) {
    throw new Error("Failed to fetch appointments");
  }
};
