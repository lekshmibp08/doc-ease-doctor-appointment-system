import { IFindExistingDoctorUseCase } from "../../interfaces/doctor/doctorUsecaseInterfaces";
import { IDoctorRepository } from "../../../../domain/repositories/IDoctorRepository";

export class FindExistingDoctorUseCase implements IFindExistingDoctorUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute( email: string ) {
    return await this.doctorRepository.findByEmail(email);
  }
}
