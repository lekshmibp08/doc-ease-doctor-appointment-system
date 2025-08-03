import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export class ToggleBlockDoctorUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(id: string) {
    const doctor = await this.doctorRepository.findDoctorById(id);

    if (!doctor) {
      throw new Error("Doctor not found");
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
