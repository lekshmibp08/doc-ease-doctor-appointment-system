import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";

export const getAppointmentsByIdUseCase = async (
  appointmentId: string,
  appointmentRepository: IAppointmentRepository
): Promise<any> => {
  try {
    const appointment = await appointmentRepository.findAppointmentsByIdWithDocDetails(appointmentId);
    
    return appointment;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch appointments");
  }
};
