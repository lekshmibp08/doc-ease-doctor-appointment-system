import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { AppError } from "../../../../shared/errors/appError";

export class ToggleBlockDoctorUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(id: string) {
    const doctor = await this.doctorRepository.findDoctorById(id);

    if (!doctor) {
      throw new AppError("Doctor not found", HttpStatusCode.NOT_FOUND);
    }

    const updatedStatus = !doctor.isBlocked;

    await this.doctorRepository.updateDoctor(id, { isBlocked: updatedStatus });

    return {
      isBlocked: updatedStatus,
      message: `User has been ${
        updatedStatus ? "Blocked" : "Unblocked"
      } successfully`,
    };
  }
}
