import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";

export const listAllAppointmentsForAdmin  = async (
    appointmentRepository: IAppointmentRepository, 
    page: number, 
    size: number, 
    searchQuery: string
) => {
  const skip = (page - 1) * size;
  const limit = size;

  console.log("SEARCH USECASE: ", searchQuery);
  
  const appointments = await appointmentRepository.getAppointmentsWithPagination(skip, limit, searchQuery);
  const totalAppointments = await appointmentRepository.countAppointments(searchQuery)
  const totalPages = Math.ceil(totalAppointments / size);

  return {
    appointments,
    totalAppointments,
    totalPages
  };
};



