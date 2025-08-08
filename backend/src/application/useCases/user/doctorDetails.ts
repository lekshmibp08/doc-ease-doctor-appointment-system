import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { Doctor } from "../../../domain/entities/Doctor";
import { AppError } from "../../../shared/errors/appError";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";

export class DoctorDetails {
  constructor(private doctorRepository: IDoctorRepository) {}
  async execute(id: string): Promise<Partial<Doctor>> {
    const docDetails = await this.doctorRepository.findDoctorById(id);
    if (!docDetails) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }
    const { password, documents, ...details } = docDetails;

    return details;
  }
}
