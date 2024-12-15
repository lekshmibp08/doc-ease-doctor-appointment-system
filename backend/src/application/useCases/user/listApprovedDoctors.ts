import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export const listApprovedDoctors = async (doctorRepository: IDoctorRepository) => {
  const doctors = await doctorRepository.getAllApprovedDoctors();
  return doctors;
};
