import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";

export class ListAllAppointmentsForAdmin {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(page: number, size: number, searchQuery: string) {
    const skip = (page - 1) * size;
    const limit = size;

    const appointments =
      await this.appointmentRepository.getAppointmentsWithPagination(
        skip,
        limit,
        searchQuery
      );
    const totalAppointments =
      await this.appointmentRepository.countAppointments(searchQuery);
    const totalPages = Math.ceil(totalAppointments / size);

    return {
      appointments,
      totalAppointments,
      totalPages,
    };
  }
}
