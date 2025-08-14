import { IFetchSpecializationsUseCase } from "../../interfaces/user/userUseCaseInterfaces";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";

export class FetchSpecializationsUseCase
  implements IFetchSpecializationsUseCase
{
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(): Promise<any> {
    const specializations = await this.doctorRepository.getAllSpecializations();
    return specializations;
  }
}
