import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";
import { Doctor } from "../../../../domain/entities/Doctor";
import { AppError } from "../../../../shared/errors/appError";
import { HttpStatusCode } from "../../../../enums/HttpStatusCode";
import { stripBaseUrl } from "../../../helper/stripBaseUrl";

export class DoctorDetails {
  constructor(private doctorRepository: IDoctorRepository) {}
  async execute(id: string): Promise<Partial<Doctor>> {
    const docDetails = await this.doctorRepository.findDoctorById(id);
    if (!docDetails) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }
    const { password, documents, ...rest } = docDetails;

    const details: Partial<Doctor> = {
      ...rest,
      profilePicture: stripBaseUrl(rest.profilePicture),
      gallery: rest.gallery?.map((url) => stripBaseUrl(url))
    };

    return details;
  }
}
