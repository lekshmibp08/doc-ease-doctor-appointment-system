import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";

export const listApprovedDoctors = async (doctorRepository: IDoctorRepository) => {
  const doctors = await doctorRepository.getAllApprovedDoctors();
  return doctors.map((doctor) => ({
    fullName: doctor.fullName,
    email: doctor.email,
    mobileNumber: doctor.mobileNumber,
  }));
};
