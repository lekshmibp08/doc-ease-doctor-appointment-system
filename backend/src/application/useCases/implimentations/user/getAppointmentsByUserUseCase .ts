import { IAppointmentRepository } from "../../../../domain/repositories/IAppointmentRepository";
import { AppointmentsByUserIdDTO } from "../../../../dtos/dtos";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { mapToAppointmentsByUserDTO } from "../../../../infrastructure/database/mappers/mapToAppointmentsByUserDTO";
import { AppError } from "../../../../shared/errors/appError";
import { IGetAppointmentsByUserUseCase } from "../../interfaces/user/userUseCaseInterfaces";

export class GetAppointmentsByUserUseCase
  implements IGetAppointmentsByUserUseCase
{
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async execute(userId: string): Promise<AppointmentsByUserIdDTO> {
    try {
      const appointments =
        await this.appointmentRepository.getAppointmentsByUserId(userId);
      return appointments.map(mapToAppointmentsByUserDTO);
    } catch (error: any) {
      throw new AppError(
        error.message || "Failed to fetch appointments",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
