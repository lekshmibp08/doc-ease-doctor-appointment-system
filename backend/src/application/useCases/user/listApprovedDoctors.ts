import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export const listApprovedDoctors = async (
  doctorRepository: IDoctorRepository,
  criteria: {
    page: number;
    size: number;
    search?: string;
    location?: string;
    gender?: string;
    experience?: string;
    availability?: string;
    fees?: string;
    department?: string;
    sort?: string;
  }
) => {
  const result = await doctorRepository.getDoctorsByCriteria(criteria);
  return result;
};
