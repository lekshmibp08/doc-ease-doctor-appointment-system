import { IToggleBlockDoctorUseCase } from "../../interfaces/admin/adminUseCaseInterfaces";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { AppError } from "../../../../shared/errors/appError";
import { ToggleBlockDoctorOutputDTO } from "../../../dto/adminUseCaseDtos";

export class ToggleBlockDoctorUseCase implements IToggleBlockDoctorUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(id: string): Promise<ToggleBlockDoctorOutputDTO> {
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
