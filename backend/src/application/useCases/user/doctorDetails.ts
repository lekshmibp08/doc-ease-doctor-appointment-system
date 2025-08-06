import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { Doctor } from "../../../domain/entities/Doctor";

export class DoctorDetails {
  constructor(private doctorRepository: IDoctorRepository) {}
  async execute(id: string): Promise<Partial<Doctor>> {
    const docDetails = await this.doctorRepository.findDoctorById(id);
    if (!docDetails) {
      throw new Error("User not found");
    }
    const { password, documents, ...details } = docDetails;

    return details;
  }
}
