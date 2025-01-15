import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export const fetchSpecializationsUseCase = async (
  doctorRepository: IDoctorRepository
): Promise<any> => {
  const specializations = await doctorRepository.getAllSpecializations();
  return specializations;
};
