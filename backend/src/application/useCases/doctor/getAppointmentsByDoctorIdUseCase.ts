import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { mapToAppointmentsByDocDTO } from "../../../infrastructure/database/mappers/mapToAppointmentsByDocDTO";
import { AppointmentsByDocIdDTO } from "../../../dtos/dtos";

export class GetAppointmentsByDoctorIdUseCase {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(
    doctorId: string,
    date: string,
    page: number,
    size: number
  ): Promise<{
    appointments: AppointmentsByDocIdDTO[];
    totalAppointments: number;
    totalPages: number;
  }> {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const selectedDate = new Date(date as string);
    selectedDate.setHours(0, 0, 0, 0);

    const filter = {
      doctorId,
      date: { $gte: startOfDay, $lt: endOfDay },
    };

    const skip = (page - 1) * size;
    const limit = size;

    const { appointments, totalAppointments } =
      await this.appointmentRepository.getAppointmentsByDoctorId(
        filter,
        skip,
        limit
      );
    const totalPages = Math.ceil(totalAppointments / size);

    return {
      appointments: appointments.map(mapToAppointmentsByDocDTO),
      totalAppointments,
      totalPages,
    };
  }
}
